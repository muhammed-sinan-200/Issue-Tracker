import {
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const issueStatusEnum = pgEnum("issue_status", [
  "open",
  "in_progress",
  "resolved",
]);

export const issuePriorityEnum = pgEnum("issue_priority", [
  "low",
  "medium",
  "high",
]);

export const issueCategoryEnum = pgEnum("issue_category", [
  "electrical",
  "water",
  "internet",
  "classroom",
  "maintenance",
  "other",
]);

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "maintenance_admin",
  "school_office",
]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  role: userRoleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const issues = pgTable("issues", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  imageUrl: text("image_url"),
  category: issueCategoryEnum("category").notNull(),
  status: issueStatusEnum("status").default("open").notNull(),
  priority: issuePriorityEnum("priority").default("medium").notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
  .defaultNow()
  .$onUpdate(() => new Date())
  .notNull(),
});

export const discussions = pgTable("discussions", {
  id: uuid("id").primaryKey().defaultRandom(),
  issueId: uuid("issue_id")
    .notNull()
    .references(() => issues.id),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id),

  message: text("message").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});

export const aiAnalyses = pgTable("ai_analyses", {
  id: uuid("id").primaryKey().defaultRandom(),

  issueId: uuid("issue_id")
    .notNull()
    .references(() => issues.id),

  analysis: text("analysis").notNull(),

  createdAt: timestamp("created_at")
    .defaultNow()
    .notNull(),
});