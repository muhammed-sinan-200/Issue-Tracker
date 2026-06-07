import { Request, Response } from "express";
import { z, ZodError } from "zod";
import * as aiService from "../services/ai.service";

const analyzeIssueSchema = z.object({
  issueId: z.uuid("Issue id must be a valid uuid"),
});

export async function analyzeIssue(req: Request, res: Response) {
  try {
    const { issueId } = analyzeIssueSchema.parse(req.params);
    const result = await aiService.analyzeIssue(issueId);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "AI analysis generated successfully",
      data: result,
    });
  } catch (error) {
    console.error("[AI] Analysis request failed:", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    const message =
      error instanceof Error ? error.message : "Something went wrong";

    const status = message.includes("GEMINI_API_KEY")
      ? 503
      : message.includes("Gemini API error")
        ? 502
        : 500;

    return res.status(status).json({
      success: false,
      message,
    });
  }
}
