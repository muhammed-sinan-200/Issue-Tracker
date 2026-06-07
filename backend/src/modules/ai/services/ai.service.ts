import { asc, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "../../../db";
import { aiAnalyses, discussions, issues, users } from "../../../db/schema";

type IssueRecord = typeof issues.$inferSelect;

type DiscussionWithUser = {
  message: string;
  user: {
    name: string;
  };
};

const aiAnalysisSchema = z.object({
  summary: z.string().min(1, "Summary is required"),
  severity: z.enum(["low", "medium", "high"]),
  fix: z.array(z.string().min(1)).min(1, "At least one fix step is required"),
  justification: z.string().min(1, "Justification is required"),
});

async function getIssueById(issueId: string) {
  const [issue] = await db
    .select()
    .from(issues)
    .where(eq(issues.id, issueId));

  return issue ?? null;
}

async function getDiscussionsByIssueId(issueId: string) {
  return db
    .select({
      message: discussions.message,
      user: {
        name: users.name,
      },
    })
    .from(discussions)
    .innerJoin(users, eq(discussions.userId, users.id))
    .where(eq(discussions.issueId, issueId))
    .orderBy(asc(discussions.createdAt));
}

async function getLatestAnalysis(issueId: string) {
  const [cached] = await db
    .select({ analysis: aiAnalyses.analysis })
    .from(aiAnalyses)
    .where(eq(aiAnalyses.issueId, issueId))
    .orderBy(desc(aiAnalyses.createdAt))
    .limit(1);

  return cached ?? null;
}

function buildPrompt(issue: IssueRecord, issueDiscussions: DiscussionWithUser[]) {
  const discussionLines =
    issueDiscussions.length > 0
      ? issueDiscussions
          .map((discussion) => `- ${discussion.user.name}: ${discussion.message}`)
          .join("\n")
      : "- No discussions yet";

  return `You are an expert issue analysis system for a school management platform.

Issue:
Title: ${issue.title}
Description: ${issue.description}
Category: ${issue.category}
Status: ${issue.status}
Priority: ${issue.priority}

Discussions:
${discussionLines}

Task:
Analyze the issue and return ONLY valid JSON in this exact shape:
{
  "summary": "2-3 sentence problem summary",
  "severity": "low" | "medium" | "high",
  "fix": ["practical step 1", "practical step 2"],
  "justification": "brief priority justification tied to user/system impact"
}

Rules:
- Return ONLY JSON
- No markdown
- No code fences
- No extra text before or after the JSON
- severity must be exactly "low", "medium", or "high"
- fix must be a JSON array of strings
- Be concise and consistent`;
}

function parseAndValidateAnalysis(raw: string) {
  const trimmed = raw.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  const jsonText = fencedMatch ? fencedMatch[1].trim() : trimmed;

  let parsed: unknown;

  try {
    parsed = JSON.parse(jsonText);
  } catch {
    throw new Error("AI returned invalid JSON");
  }

  const validated = aiAnalysisSchema.parse(parsed);

  return JSON.stringify(validated);
}

async function callGeminiAPI(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  const requestPayload = {
    contents: [
      {
        parts: [{ text: prompt }],
      },
    ],
  };

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(
      "[Gemini] Request failed:",
      response.status,
      response.statusText,
      errorText
    );
    throw new Error("Gemini API request failed");
  }

  const data = (await response.json()) as {
    candidates?: Array<{
      content?: {
        parts?: Array<{ text?: string }>;
      };
    }>;
  };

  const analysis = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!analysis) {
    throw new Error("No analysis returned from Gemini");
  }

  return analysis;
}

async function saveAnalysis(issueId: string, analysis: string) {
  await db.insert(aiAnalyses).values({
    issueId,
    analysis,
  });
}

export async function analyzeIssue(issueId: string) {
  const issue = await getIssueById(issueId);

  if (!issue) {
    return null;
  }

  const cached = await getLatestAnalysis(issueId);

  if (cached) {
    return { analysis: cached.analysis };
  }

  try {
    const issueDiscussions = await getDiscussionsByIssueId(issueId);
    const prompt = buildPrompt(issue, issueDiscussions);
    const rawAnalysis = await callGeminiAPI(prompt);
    const analysis = parseAndValidateAnalysis(rawAnalysis);

    await saveAnalysis(issueId, analysis);

    return { analysis };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("[Gemini] Response validation failed:", error.issues);
      throw new Error("AI response failed validation");
    }

    console.error("[Gemini] Analysis failed:", error);
    throw error instanceof Error ? error : new Error("AI analysis failed");
  }
}
