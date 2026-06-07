import { z } from "zod";

const issueCategories = [
  "electrical",
  "water",
  "internet",
  "classroom",
  "maintenance",
  "other",
] as const;

const issuePriorities = ["low", "medium", "high"] as const;

const issueStatuses = ["open", "in_progress", "resolved"] as const;

export const createIssueSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  category: z.enum(issueCategories),
  priority: z.enum(issuePriorities).optional(),
  createdBy: z.uuid("Created by must be a valid user id"),
  imageUrl: z.string().optional(),
});

export const getIssuesQuerySchema = z.object({
  status: z.enum(issueStatuses).optional(),
  priority: z.enum(issuePriorities).optional(),
  category: z.enum(issueCategories).optional(),
});

export const getIssueByIdSchema = z.object({
  id: z.uuid("Issue id must be a valid uuid"),
});

export const updateIssueStatusParamsSchema = z.object({
  id: z.uuid("Issue id must be a valid uuid"),
});

export const updateIssueStatusBodySchema = z.object({
  status: z.enum(issueStatuses),
});

export type CreateIssueInput = z.infer<typeof createIssueSchema>;
export type GetIssuesQuery = z.infer<typeof getIssuesQuerySchema>;
export type UpdateIssueStatusInput = z.infer<typeof updateIssueStatusBodySchema>;
