import type { UserRole } from "@/types/user";

export const ACTIVE_USER_STORAGE_KEY = "activeUserId";

const ROLE_LABELS: Record<UserRole, string> = {
  student: "Student",
  maintenance_admin: "Maintenance",
  school_office: "Office",
};

export function formatUserRole(role: UserRole): string {
  return ROLE_LABELS[role];
}

export function readStoredUserId(): string | null {
  try {
    const stored = localStorage.getItem(ACTIVE_USER_STORAGE_KEY);
    return stored?.trim() || null;
  } catch {
    return null;
  }
}

export function resolveInitialUserId(
  users: Array<{ id: string }>,
  storedId: string | null,
): string | null {
  if (users.length === 0) {
    return null;
  }

  const validIds = new Set(users.map((user) => user.id));

  if (storedId && validIds.has(storedId)) {
    return storedId;
  }

  const envId = process.env.NEXT_PUBLIC_DEFAULT_USER_ID?.trim();
  if (envId && validIds.has(envId)) {
    return envId;
  }

  return users[0].id;
}
