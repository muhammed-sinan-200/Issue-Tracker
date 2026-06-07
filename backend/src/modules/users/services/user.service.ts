import { asc } from "drizzle-orm";
import { db } from "../../../db";
import { users } from "../../../db/schema";

export async function getAllUsers() {
  return db
    .select({
      id: users.id,
      name: users.name,
      role: users.role,
    })
    .from(users)
    .orderBy(asc(users.name));
}
