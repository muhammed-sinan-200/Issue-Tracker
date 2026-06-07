import "dotenv/config";
import { db } from "./index";
import { users } from "./schema";

async function seedUsers() {
  try {
    await db.insert(users).values([
      {
        name: "Steve",
        role: "student",
      },
      {
        name: "Arjun",
        role: "student",
      },
      {
        name: "Sinan",
        role: "student",
      },
      {
        name: "Diya",
        role: "student",
      },
      {
        name: "Maintenance Team",
        role: "maintenance_admin",
      },
      {
        name: "Office Staff",
        role: "school_office",
      },
    ]);

    console.log("Seed data inserted successfully");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seedUsers();