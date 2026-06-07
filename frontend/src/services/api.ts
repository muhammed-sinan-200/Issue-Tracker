import type {
  AiAnalysis,
  CreateDiscussionInput,
  CreateIssueInput,
  Discussion,
  Issue,
  IssueWithCreator,
} from "@/types/issue";
import type { User } from "@/types/user";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

/**
 * All GET requests use `cache: "no-store"` so Next.js Server Components
 * always fetch fresh data. Mutations (POST/PATCH) are never cached.
 * There is no client-side response cache (no SWR/React Query).
 */
const READ_FETCH_OPTIONS: RequestInit = { cache: "no-store" };

type ApiSuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

type ApiErrorResponse = {
  success: false;
  message: string;
  errors?: Array<{
    message?: string;
    path?: Array<string | number>;
  }>;
};

export class ApiError extends Error {
  status: number;
  details?: ApiErrorResponse["errors"];

  constructor(message: string, status: number, details?: ApiErrorResponse["errors"]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

function formatErrorMessage(body: ApiErrorResponse): string {
  if (body.errors?.length) {
    const details = body.errors
      .map((issue) => {
        const field = issue.path?.length ? issue.path.join(".") : "field";
        return `${field}: ${issue.message ?? "Invalid value"}`;
      })
      .join("; ");
    return `${body.message} — ${details}`;
  }

  return body.message || "Request failed";
}

async function parseResponse<T>(response: Response, path: string): Promise<T> {
  let body: ApiSuccessResponse<T> | ApiErrorResponse;

  try {
    body = (await response.json()) as ApiSuccessResponse<T> | ApiErrorResponse;
  } catch {
    console.error("[API Error]", path, response.status, "Non-JSON response");
    throw new ApiError(`Invalid response from server (${response.status})`, response.status);
  }

  if (!response.ok || !("success" in body) || !body.success) {
    const errorBody = body as ApiErrorResponse;
    const message = formatErrorMessage(errorBody);
    console.error("[API Error]", path, response.status, errorBody);
    throw new ApiError(message, response.status, errorBody.errors);
  }

  return body.data;
}

async function fetchApi(path: string, options: RequestInit = {}): Promise<Response> {
  const method = options.method?.toUpperCase() ?? "GET";

  return fetch(`${API_URL}${path}`, {
    ...(method === "GET" ? READ_FETCH_OPTIONS : {}),
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetchApi(path, options);
  return parseResponse<T>(response, path);
}

export async function getUsers(): Promise<User[]> {
  return request<User[]>("/users");
}

export async function getIssues(): Promise<Issue[]> {
  return request<Issue[]>("/issues");
}

export async function getIssueById(id: string): Promise<IssueWithCreator> {
  return request<IssueWithCreator>(`/issues/${id}`);
}

export async function updateIssueStatus(
  id: string,
  status: Issue["status"],
): Promise<Issue> {
  return request<Issue>(`/issues/${id}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function createIssue(data: CreateIssueInput): Promise<Issue> {
  const payload: Record<string, string> = {
    title: data.title.trim(),
    description: data.description.trim(),
    category: data.category,
    createdBy: data.createdBy,
  };

  if (data.priority) {
    payload.priority = data.priority;
  }

  if (data.imageUrl) {
    payload.imageUrl = data.imageUrl;
  }

  return request<Issue>("/issues", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getDiscussions(issueId: string): Promise<Discussion[]> {
  const path = `/discussions/issue/${issueId}`;
  const response = await fetchApi(path);

  if (response.status === 404) {
    return [];
  }

  return parseResponse<Discussion[]>(response, path);
}

export async function createDiscussion(
  data: CreateDiscussionInput,
): Promise<Discussion> {
  return request<Discussion>("/discussions", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

function parseAiAnalysisPayload(analysis: unknown): AiAnalysis {
  if (typeof analysis === "object" && analysis !== null) {
    return analysis as AiAnalysis;
  }

  if (typeof analysis === "string") {
    try {
      return JSON.parse(analysis) as AiAnalysis;
    } catch {
      throw new ApiError("AI analysis response is not valid JSON", 500);
    }
  }

  throw new ApiError("AI analysis response is missing or invalid", 500);
}

export async function generateAIAnalysis(
  issueId: string,
): Promise<AiAnalysis> {
  const data = await request<{ analysis: string | AiAnalysis }>(
    `/ai/analyze/${issueId}`,
    { method: "POST" },
  );

  return parseAiAnalysisPayload(data.analysis);
}
