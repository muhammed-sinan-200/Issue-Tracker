import Link from "next/link";
import { notFound } from "next/navigation";
import { IssueAiPanel } from "@/components/IssueAiPanel";
import { IssueDiscussions } from "@/components/IssueDiscussions";
import { IssueStatusControl } from "@/components/IssueStatusControl";
import { getDiscussions, getIssueById } from "@/services/api";
import {
  formatCategory,
  formatDate,
  formatPriority,
} from "@/lib/format";
import type { Discussion } from "@/types/issue";

type IssueDetailPageProps = {
  params: Promise<{ id: string }>;
};

type DisplayPriority = "Low" | "Medium" | "High";

const priorityStyles: Record<DisplayPriority, string> = {
  Low: "bg-white/5 text-zinc-400",
  Medium: "bg-amber-500/10 text-amber-400/90",
  High: "bg-red-500/10 text-red-400/90",
};

export default async function IssueDetailPage({ params }: IssueDetailPageProps) {
  const { id } = await params;

  let issue;
  let discussions: Discussion[] = [];

  try {
    issue = await getIssueById(id);
  } catch {
    notFound();
  }

  discussions = await getDiscussions(id);

  const priority = formatPriority(issue.priority) as DisplayPriority;
  const category = formatCategory(issue.category);

  return (
    <section className="min-w-0 overflow-x-hidden">
      <div className="grid min-w-0 grid-cols-1 gap-6 sm:gap-8 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-8">
        <header className="min-w-0 space-y-4 lg:col-span-8 lg:row-start-1">
          <Link
            href="/dashboard"
            className="inline-block text-sm text-zinc-500 transition-colors hover:text-white"
          >
            ← Back
          </Link>

          <h1 className="break-words text-xl font-semibold leading-snug tracking-tight text-white sm:text-2xl md:text-3xl">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-xs">
            <IssueStatusControl
              issueId={issue.id}
              initialStatus={issue.status}
            />
            <span
              className={`shrink-0 rounded px-2 py-0.5 font-medium ${priorityStyles[priority]}`}
            >
              {priority}
            </span>
            <span className="shrink-0 rounded bg-white/5 px-2 py-0.5 font-medium text-zinc-400">
              {category}
            </span>
            <span className="hidden text-zinc-700 sm:inline">·</span>
            <time className="shrink-0 text-zinc-500">{formatDate(issue.createdAt)}</time>
            <span className="hidden text-zinc-700 sm:inline">·</span>
            <span className="min-w-0 text-zinc-500">
              Reported by{" "}
              <span className="text-zinc-400">{issue.creator.name}</span>
            </span>
          </div>
        </header>

        <section className="min-w-0 space-y-3 lg:col-span-8 lg:row-start-2">
          <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Description
          </h2>
          <p className="break-words text-sm leading-relaxed text-zinc-400">
            {issue.description}
          </p>
        </section>

        <IssueDiscussions
          key={id}
          issueId={id}
          initialDiscussions={discussions}
          className="lg:col-span-4 lg:col-start-9 lg:row-start-1 lg:row-span-3 lg:self-start"
        />

        <section className="min-w-0 border-t border-white/[0.08] pt-6 sm:pt-8 lg:col-span-8 lg:row-start-3 lg:border-t lg:pt-8">
          <IssueAiPanel key={id} issueId={id} />
        </section>
      </div>
    </section>
  );
}
