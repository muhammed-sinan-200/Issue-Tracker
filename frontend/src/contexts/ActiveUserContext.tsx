"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getUsers } from "@/services/api";
import type { User } from "@/types/user";
import {
  ACTIVE_USER_STORAGE_KEY,
  readStoredUserId,
  resolveInitialUserId,
} from "@/lib/users";

type ActiveUserContextValue = {
  users: User[];
  activeUser: User;
  setActiveUserId: (id: string) => void;
  loading: boolean;
  error: string | null;
};

const ActiveUserContext = createContext<ActiveUserContextValue | null>(null);

export function ActiveUserProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [users, setUsers] = useState<User[]>([]);
  const [activeUserId, setActiveUserIdState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUsers() {
      try {
        const fetchedUsers = await getUsers();

        if (cancelled) {
          return;
        }

        if (fetchedUsers.length === 0) {
          setUsers([]);
          setActiveUserIdState(null);
          setError("No users available. Run the backend seed script first.");
          return;
        }

        const storedId = readStoredUserId();
        const resolvedId = resolveInitialUserId(fetchedUsers, storedId);

        setUsers(fetchedUsers);
        setActiveUserIdState(resolvedId);
        setError(null);
      } catch (err) {
        if (cancelled) {
          return;
        }

        const message =
          err instanceof Error ? err.message : "Failed to load users from server";

        setUsers([]);
        setActiveUserIdState(null);
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    loadUsers();

    return () => {
      cancelled = true;
    };
  }, []);

  const setActiveUserId = useCallback(
    (id: string) => {
      if (!users.some((user) => user.id === id)) {
        return;
      }

      setActiveUserIdState(id);
      localStorage.setItem(ACTIVE_USER_STORAGE_KEY, id);
    },
    [users],
  );

  const activeUser = useMemo(() => {
    if (!activeUserId) {
      return users[0] ?? null;
    }

    return users.find((user) => user.id === activeUserId) ?? users[0] ?? null;
  }, [users, activeUserId]);

  const value = useMemo(
    () =>
      activeUser
        ? {
            users,
            activeUser,
            setActiveUserId,
            loading,
            error,
          }
        : null,
    [users, activeUser, setActiveUserId, loading, error],
  );

  if (loading) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p className="text-sm text-zinc-500">Loading users...</p>
      </div>
    );
  }

  if (!value) {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4">
        <p className="text-center text-sm text-red-400/90">
          {error ?? "Unable to load users."}
        </p>
      </div>
    );
  }

  return (
    <ActiveUserContext.Provider value={value}>
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser(): ActiveUserContextValue {
  const context = useContext(ActiveUserContext);

  if (!context) {
    throw new Error("useActiveUser must be used within ActiveUserProvider");
  }

  return context;
}
