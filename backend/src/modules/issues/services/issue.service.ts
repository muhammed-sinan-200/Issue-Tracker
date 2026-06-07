import { and, desc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { issues, users } from "../../../db/schema";
import type {
  CreateIssueInput,
  GetIssuesQuery,
  UpdateIssueStatusInput,
} from "../validators/issue.validation";

export async function createIssue(data: CreateIssueInput) {
  const [issue] = await db
    .insert(issues)
    .values({
      title: data.title,
      description: data.description,
      category: data.category,
      priority: data.priority,
      createdBy: data.createdBy,
      imageUrl: data.imageUrl,
    })
    .returning();

  return issue;
}

export async function getAllIssues(filters: GetIssuesQuery) {
  return db
    .select()
    .from(issues)
    .where(
      and(
        filters.status ? eq(issues.status, filters.status) : undefined,
        filters.priority ? eq(issues.priority, filters.priority) : undefined,
        filters.category ? eq(issues.category, filters.category) : undefined
      )
    )
    .orderBy(desc(issues.createdAt));
}

export async function getIssueById(id: string) {
  const [result] = await db
    .select({
      id: issues.id,
      title: issues.title,
      description: issues.description,
      imageUrl: issues.imageUrl,
      category: issues.category,
      status: issues.status,
      priority: issues.priority,
      createdBy: issues.createdBy,
      createdAt: issues.createdAt,
      updatedAt: issues.updatedAt,
      creator: {
        id: users.id,
        name: users.name,
        role: users.role,
        createdAt: users.createdAt,
      },
    })
    .from(issues)
    .innerJoin(users, eq(issues.createdBy, users.id))
    .where(eq(issues.id, id));

  return result ?? null;
}

export async function updateIssueStatus(
  id: string,
  data: UpdateIssueStatusInput,
) {
  const [issue] = await db
    .update(issues)
    .set({ status: data.status })
    .where(eq(issues.id, id))
    .returning();

  return issue ?? null;
}
