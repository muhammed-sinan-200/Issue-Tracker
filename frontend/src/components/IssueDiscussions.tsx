"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { createDiscussion } from "@/services/api";
import { useActiveUser } from "@/contexts/ActiveUserContext";
import { formatDateTime } from "@/lib/format";
import type { Discussion } from "@/types/issue";

type IssueDiscussionsProps = {
  issueId: string;
  initialDiscussions: Discussion[];
  className?: string;
};

const scrollClassName =
  "min-h-0 flex-1 overflow-y-auto [scrollbar-color:rgba(255,255,255,0.12)_transparent] [scrollbar-width:thin] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-white/10 [&::-webkit-scrollbar-track]:bg-transparent";

function SendArrowIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

export function IssueDiscussions({
  issueId,
  initialDiscussions,
  className = "",
}: IssueDiscussionsProps) {
  const { activeUser } = useActiveUser();
  const [discussions, setDiscussions] = useState(initialDiscussions);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setDiscussions(initialDiscussions);
  }, [initialDiscussions]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) {
      return;
    }

    requestAnimationFrame(() => {
      container.scrollTop = container.scrollHeight;
    });
  }, [discussions]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed) {
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const created = await createDiscussion({
        issueId,
        userId: activeUser.id,
        message: trimmed,
      });

      setDiscussions((current) => [
        ...current,
        {
          ...created,
          user: {
            id: activeUser.id,
            name: activeUser.name,
            role: activeUser.role,
          },
        },
      ]);
      setMessage("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      className={`flex min-w-0 flex-col border-t border-white/[0.08] pt-6 h-[min(420px,55vh)] sm:h-[420px] sm:pt-8 lg:h-[min(560px,calc(100vh-8rem))] lg:border-t-0 lg:border-l lg:border-white/[0.08] lg:pt-0 lg:pl-6 lg:pr-1 xl:pl-8 ${className}`}
    >
      <h2 className="shrink-0 text-xs font-medium uppercase tracking-wide text-zinc-500">
        Discussion
      </h2>

      <div ref={scrollContainerRef} className={`mt-3 ${scrollClassName}`}>
        {discussions.length === 0 ? (
          <p className="text-sm text-zinc-600">No discussions yet</p>
        ) : (
          <ul className="space-y-4 pb-1">
            {discussions.map((comment) => (
              <li key={comment.id}>
                <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  <span className="text-sm font-medium text-white">
                    {comment.user.name}
                  </span>
                  <time className="shrink-0 text-[11px] text-zinc-600">
                    {formatDateTime(comment.createdAt)}
                  </time>
                </div>
                <p className="mt-0.5 break-words text-sm leading-relaxed text-zinc-400">
                  {comment.message}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-4 shrink-0 border-t border-white/[0.08] pt-4"
      >
        <div className="flex items-center gap-2">
          <textarea
            rows={1}
            placeholder="Write a message..."
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            disabled={submitting}
            className="h-10 min-h-10 flex-1 resize-none rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-2 text-sm leading-5 text-white placeholder:text-zinc-600 outline-none focus:border-white/[0.15] disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={submitting || !message.trim()}
            aria-label={submitting ? "Sending message" : "Send message"}
            className="flex size-10 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-white/[0.05] text-zinc-400 transition-colors hover:border-white/[0.15] hover:bg-white/[0.1] hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
          >
            <SendArrowIcon />
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-400/90">{error}</p>
        )}
      </form>
    </section>
  );
}
