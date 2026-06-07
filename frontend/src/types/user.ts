export type UserRole = "student" | "maintenance_admin" | "school_office";

export type User = {
  id: string;
  name: string;
  role: UserRole;
};
