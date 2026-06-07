import { z } from "zod";

export const createDiscussionSchema = z.object({
  issueId: z.string().uuid("Issue id must be a valid uuid"),
  userId: z.string().uuid("User id must be a valid uuid"),
  message: z.string().trim().min(1, "Message is required"),
});

export const getDiscussionsByIssueSchema = z.object({
  issueId: z.string().uuid("Issue id must be a valid uuid"),
});

export type CreateDiscussionInput = z.infer<typeof createDiscussionSchema>;
