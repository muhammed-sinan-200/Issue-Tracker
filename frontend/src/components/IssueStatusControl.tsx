"use client";

import { useState } from "react";
import { updateIssueStatus } from "@/services/api";
import { formatStatus, ISSUE_STATUSES, STATUS_STYLES } from "@/lib/format";
import type { IssueStatus } from "@/types/issue";

type IssueStatusControlProps = {
  issueId: string;
  initialStatus: IssueStatus;
};

export function IssueStatusControl({
  issueId,
  initialStatus,
}: IssueStatusControlProps) {
  const [status, setStatus] = useState(initialStatus);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleChange(newStatus: IssueStatus) {
    if (newStatus === status || loading) {
      return;
    }

    const previousStatus = status;
    setLoading(true);
    setError(null);

    try {
      const updated = await updateIssueStatus(issueId, newStatus);
      setStatus(updated.status);
    } catch (err) {
      setStatus(previousStatus);
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <span className="inline-flex max-w-full flex-col gap-1">
      <select
        value={status}
        onChange={(event) => handleChange(event.target.value as IssueStatus)}
        disabled={loading}
        aria-label="Issue status"
        className={`max-w-full cursor-pointer rounded px-2 py-0.5 text-xs font-medium outline-none transition-opacity focus:ring-1 focus:ring-white/20 disabled:cursor-wait disabled:opacity-60 ${STATUS_STYLES[status]}`}
      >
        {ISSUE_STATUSES.map((value) => (
          <option key={value} value={value} className="bg-[#090909] text-white">
            {formatStatus(value)}
          </option>
        ))}
      </select>
      {loading && (
        <span className="text-[10px] text-zinc-600">Updating...</span>
      )}
      {error && (
        <span className="text-[10px] text-red-400/90">{error}</span>
      )}
    </span>
  );
}
