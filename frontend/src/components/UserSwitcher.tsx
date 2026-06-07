"use client";

import { useActiveUser } from "@/contexts/ActiveUserContext";
import { formatUserRole } from "@/lib/users";

const selectClassName =
  "min-w-0 w-full max-w-full cursor-pointer rounded-md border border-white/[0.08] bg-white/[0.03] py-1.5 pl-2 pr-7 text-xs text-zinc-300 outline-none focus:border-white/[0.15] sm:w-auto sm:max-w-[240px]";

export function UserSwitcher() {
  const { users, activeUser, setActiveUserId } = useActiveUser();

  return (
    <div className="flex min-w-0 items-center gap-2">
      <span className="hidden text-xs text-zinc-500 sm:inline">Signed in as</span>
      <select
        value={activeUser.id}
        onChange={(event) => setActiveUserId(event.target.value)}
        className={selectClassName}
        aria-label="Switch account"
      >
        {users.map((user) => (
          <option key={user.id} value={user.id} className="bg-[#090909]">
            {user.name} ({formatUserRole(user.role)})
          </option>
        ))}
      </select>
    </div>
  );
}
