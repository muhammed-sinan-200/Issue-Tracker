export type IssueCategory =
  | "electrical"
  | "water"
  | "internet"
  | "classroom"
  | "maintenance"
  | "other";

export type IssueStatus = "open" | "in_progress" | "resolved";
export type IssuePriority = "low" | "medium" | "high";
export type AiSeverity = "low" | "medium" | "high";

export type Issue = {
  id: string;
  title: string;
  description: string;
  imageUrl: string | null;
  category: IssueCategory;
  status: IssueStatus;
  priority: IssuePriority;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
};

export type IssueWithCreator = Issue & {
  creator: {
    id: string;
    name: string;
    role: string;
    createdAt: string;
  };
};

export type CreateIssueInput = {
  title: string;
  description: string;
  category: IssueCategory;
  priority?: IssuePriority;
  createdBy: string;
  imageUrl?: string;
};

export type Discussion = {
  id: string;
  issueId: string;
  userId: string;
  message: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    role: string;
  };
};

export type CreateDiscussionInput = {
  issueId: string;
  userId: string;
  message: string;
};

export type AiAnalysis = {
  summary: string;
  severity: AiSeverity;
  fix: string[];
  justification: string;
};
