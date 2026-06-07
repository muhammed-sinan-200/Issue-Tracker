import { Request, Response } from "express";
import { ZodError } from "zod";
import * as discussionService from "../services/discussion.service";
import {
  createDiscussionSchema,
  getDiscussionsByIssueSchema,
} from "../validators/discussion.validation";

export async function createDiscussion(req: Request, res: Response) {
  try {
    const validatedData = createDiscussionSchema.parse(req.body);
    const discussion = await discussionService.createDiscussion(validatedData);

    return res.status(201).json({
      success: true,
      message: "Discussion added successfully",
      data: discussion,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}

export async function getDiscussionsByIssue(req: Request, res: Response) {
  try {
    const { issueId } = getDiscussionsByIssueSchema.parse(req.params);
    const discussions = await discussionService.getDiscussionsByIssueId(issueId);

    if (discussions.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No discussions found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Discussions fetched successfully",
      data: discussions,
    });
  } catch (error) {
    if (error instanceof ZodError) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.issues,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
}
