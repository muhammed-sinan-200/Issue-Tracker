import { Request, Response } from "express";
import { ZodError } from "zod";
import * as issueService from "../services/issue.service";
import {
  createIssueSchema,
  getIssueByIdSchema,
  getIssuesQuerySchema,
  updateIssueStatusBodySchema,
  updateIssueStatusParamsSchema,
} from "../validators/issue.validation";

export async function createIssue(req: Request, res: Response) {
  try {
    const validatedData = createIssueSchema.parse(req.body);
    const issue = await issueService.createIssue(validatedData);

    return res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: issue,
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

export async function getAllIssues(req: Request, res: Response) {
  try {
    const filters = getIssuesQuerySchema.parse(req.query);
    const issues = await issueService.getAllIssues(filters);

    return res.status(200).json({
      success: true,
      message: "Issues fetched successfully",
      data: issues,
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

export async function getIssueById(req: Request, res: Response) {
  try {
    const { id } = getIssueByIdSchema.parse(req.params);
    const issue = await issueService.getIssueById(id);

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue fetched successfully",
      data: issue,
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

export async function updateIssueStatus(req: Request, res: Response) {
  try {
    const { id } = updateIssueStatusParamsSchema.parse(req.params);
    const { status } = updateIssueStatusBodySchema.parse(req.body);
    const issue = await issueService.updateIssueStatus(id, { status });

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Issue status updated successfully",
      data: issue,
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
