import { asc, eq } from "drizzle-orm";
import { db } from "../../../db";
import { discussions, users } from "../../../db/schema";
import type { CreateDiscussionInput } from "../validators/discussion.validation";

export async function createDiscussion(data: CreateDiscussionInput) {
  const [discussion] = await db
    .insert(discussions)
    .values({
      issueId: data.issueId,
      userId: data.userId,
      message: data.message,
    })
    .returning();

  return discussion;
}

export async function getDiscussionsByIssueId(issueId: string) {
  return db
    .select({
      id: discussions.id,
      issueId: discussions.issueId,
      userId: discussions.userId,
      message: discussions.message,
      createdAt: discussions.createdAt,
      user: {
        id: users.id,
        name: users.name,
        role: users.role,
      },
    })
    .from(discussions)
    .innerJoin(users, eq(discussions.userId, users.id))
    .where(eq(discussions.issueId, issueId))
    .orderBy(asc(discussions.createdAt));
}
