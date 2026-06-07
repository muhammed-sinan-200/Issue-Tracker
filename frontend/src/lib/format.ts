import type {
  AiSeverity,
  IssueCategory,
  IssuePriority,
  IssueStatus,
} from "@/types/issue";

/** Backend `issue_category` enum values (Drizzle schema) */
export const ISSUE_CATEGORIES = [
  "electrical",
  "water",
  "internet",
  "classroom",
  "maintenance",
  "other",
] as const satisfies readonly IssueCategory[];

/** Backend `issue_priority` enum values */
export const ISSUE_PRIORITIES = ["low", "medium", "high"] as const satisfies readonly IssuePriority[];

/** Backend `issue_status` enum values */
export const ISSUE_STATUSES = ["open", "in_progress", "resolved"] as const satisfies readonly IssueStatus[];

const CATEGORY_LABELS: Record<IssueCategory, string> = {
  electrical: "Electrical",
  water: "Water",
  internet: "Internet",
  classroom: "Classroom",
  maintenance: "Maintenance",
  other: "Other",
};

const PRIORITY_LABELS: Record<IssuePriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In Progress",
  resolved: "Done",
};

export const STATUS_STYLES: Record<IssueStatus, string> = {
  open: "bg-blue-500/10 text-blue-400/90",
  in_progress: "bg-violet-500/10 text-violet-400/90",
  resolved: "bg-emerald-500/10 text-emerald-400/90",
};

export function isIssueCategory(value: string): value is IssueCategory {
  return (ISSUE_CATEGORIES as readonly string[]).includes(value);
}

export function isIssuePriority(value: string): value is IssuePriority {
  return (ISSUE_PRIORITIES as readonly string[]).includes(value);
}

export function formatPriority(priority: IssuePriority): string {
  return PRIORITY_LABELS[priority];
}

export function formatStatus(status: IssueStatus): string {
  return STATUS_LABELS[status];
}

export function formatCategory(category: IssueCategory): string {
  return CATEGORY_LABELS[category];
}

export function formatSeverity(severity: AiSeverity): string {
  return PRIORITY_LABELS[severity];
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getCategoryOptions() {
  return ISSUE_CATEGORIES.map((value) => ({
    value,
    label: CATEGORY_LABELS[value],
  }));
}

export function getPriorityOptions() {
  return ISSUE_PRIORITIES.map((value) => ({
    value,
    label: PRIORITY_LABELS[value],
  }));
}
