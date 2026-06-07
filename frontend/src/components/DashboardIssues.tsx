"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  formatCategory,
  formatDate,
  formatPriority,
  formatStatus,
  getCategoryOptions,
  getPriorityOptions,
  ISSUE_STATUSES,
  STATUS_STYLES,
} from "@/lib/format";
import type { Issue, IssueCategory, IssuePriority, IssueStatus } from "@/types/issue";

type DisplayPriority = "Low" | "Medium" | "High";
type DisplayStatus = "Open" | "In Progress" | "Done";

type FilterStatus = "all" | IssueStatus;
type FilterPriority = "all" | IssuePriority;
type FilterCategory = "all" | IssueCategory;

const priorityStyles: Record<DisplayPriority, string> = {
  Low: "bg-white/5 text-zinc-400",
  Medium: "bg-amber-500/10 text-amber-400/90",
  High: "bg-red-500/10 text-red-400/90",
};

const resolvedPriorityStyle = "bg-emerald-500/10 text-emerald-400/90";

const filterSelectClassName =
  "min-w-0 w-full rounded-md border border-white/[0.08] bg-white/[0.03] px-2 py-2 text-xs text-zinc-400 outline-none focus:border-white/[0.15] sm:px-3 sm:py-2 sm:text-sm lg:w-auto";

const newIssueButtonStyles =
  "shrink-0 items-center justify-center whitespace-nowrap rounded-md bg-white px-3 py-2.5 text-sm font-medium text-black transition-colors hover:bg-zinc-200 sm:px-4";

type DashboardIssuesProps = {
  issues: Issue[];
};

export function DashboardIssues({ issues }: DashboardIssuesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<FilterStatus>("all");
  const [selectedPriority, setSelectedPriority] = useState<FilterPriority>("all");
  const [selectedCategory, setSelectedCategory] = useState<FilterCategory>("all");

  const filteredIssues = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return issues.filter((issue) => {
      if (query && !issue.title.toLowerCase().includes(query)) {
        return false;
      }
      if (selectedStatus !== "all" && issue.status !== selectedStatus) {
        return false;
      }
      if (selectedPriority !== "all" && issue.priority !== selectedPriority) {
        return false;
      }
      if (selectedCategory !== "all" && issue.category !== selectedCategory) {
        return false;
      }
      return true;
    });
  }, [issues, searchQuery, selectedStatus, selectedPriority, selectedCategory]);

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    selectedStatus !== "all" ||
    selectedPriority !== "all" ||
    selectedCategory !== "all";

  const emptyMessage =
    issues.length === 0
      ? "No issues found"
      : hasActiveFilters && filteredIssues.length === 0
        ? "No matching issues"
        : null;

  return (
    <section className="min-w-0 space-y-6 sm:space-y-8">
      <header>
        <h1 className="text-xl font-medium tracking-tight text-white">
          Issues Dashboard
        </h1>
        <p className="mt-1 text-sm text-zinc-500">Track and manage issues</p>
      </header>

      <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between lg:gap-3">
        <div className="flex min-w-0 flex-1 flex-col gap-2 lg:flex-row lg:items-center lg:gap-3">
          <div className="flex min-w-0 items-center gap-2 lg:max-w-xs lg:shrink-0">
            <input
              type="search"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="min-w-0 flex-1 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2.5 text-sm text-white placeholder:text-zinc-600 outline-none focus:border-white/[0.15] lg:w-full"
            />
            <Link
              href="/issues/new"
              className={`inline-flex ${newIssueButtonStyles} lg:hidden`}
            >
              Raise Issue
            </Link>
          </div>

          <div className="grid min-w-0 grid-cols-3 gap-1.5 sm:gap-2 lg:flex lg:flex-wrap lg:gap-2">
            <select
              value={selectedStatus}
              onChange={(event) =>
                setSelectedStatus(event.target.value as FilterStatus)
              }
              className={filterSelectClassName}
              aria-label="Filter by status"
            >
              <option value="all">All statuses</option>
              {ISSUE_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {formatStatus(status)}
                </option>
              ))}
            </select>
            <select
              value={selectedPriority}
              onChange={(event) =>
                setSelectedPriority(event.target.value as FilterPriority)
              }
              className={filterSelectClassName}
              aria-label="Filter by priority"
            >
              <option value="all">All priorities</option>
              {getPriorityOptions().map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
            <select
              value={selectedCategory}
              onChange={(event) =>
                setSelectedCategory(event.target.value as FilterCategory)
              }
              className={filterSelectClassName}
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {getCategoryOptions().map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <Link
          href="/issues/new"
          className={`hidden ${newIssueButtonStyles} lg:inline-flex`}
        >
          Raise Issue
        </Link>
      </div>

      {emptyMessage ? (
        <p className="py-12 text-center text-sm text-zinc-500">{emptyMessage}</p>
      ) : (
        <ul className="min-w-0 divide-y divide-white/[0.06]">
          {filteredIssues.map((issue) => {
            const priority = formatPriority(issue.priority) as DisplayPriority;
            const status = formatStatus(issue.status) as DisplayStatus;
            const priorityClassName =
              issue.status === "resolved"
                ? resolvedPriorityStyle
                : priorityStyles[priority];

            return (
              <li key={issue.id}>
                <Link href={`/issues/${issue.id}`} className="block min-w-0">
                  <article className="group -mx-2 flex flex-col gap-3 rounded-md px-2 py-4 transition-colors hover:bg-white/[0.04] sm:-mx-3 sm:px-3 md:flex-row md:items-center md:justify-between">
                    <div className="min-w-0 flex-1 space-y-1">
                      <h2 className="truncate text-sm font-medium text-white">
                        {issue.title}
                      </h2>
                      <p className="truncate text-xs text-zinc-500">
                        {formatCategory(issue.category)}
                      </p>
                    </div>

                    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:gap-3 md:gap-4">
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${priorityClassName}`}
                      >
                        {priority}
                      </span>
                      <span
                        className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[issue.status]}`}
                      >
                        {status}
                      </span>
                      <time className="text-xs tabular-nums text-zinc-600">
                        {formatDate(issue.createdAt)}
                      </time>
                    </div>
                  </article>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
