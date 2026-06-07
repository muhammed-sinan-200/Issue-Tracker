"use client";

import { useAiAnalysis } from "@/hooks/useAiAnalysis";
import type { AiAnalysis } from "@/types/issue";
import { formatSeverity } from "@/lib/format";

type DisplaySeverity = "Low" | "Medium" | "High";

const severityStyles: Record<DisplaySeverity, string> = {
  Low: "bg-white/5 text-zinc-400",
  Medium: "bg-amber-500/10 text-amber-400/90",
  High: "bg-red-500/10 text-red-400/90",
};

type IssueAiPanelProps = {
  issueId: string;
};

function AiAnalysisContent({ analysis }: { analysis: AiAnalysis }) {
  const displaySeverity = formatSeverity(analysis.severity) as DisplaySeverity;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h3 className="text-xs text-zinc-500">Summary</h3>
        <p className="break-words text-sm leading-relaxed text-zinc-400">
          {analysis.summary}
        </p>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs text-zinc-500">Severity</h3>
        <span
          className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${severityStyles[displaySeverity]}`}
        >
          {displaySeverity}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs text-zinc-500">Suggested Fix</h3>
        <ol className="list-decimal space-y-2 break-words pl-4 text-sm leading-relaxed text-zinc-400">
          {analysis.fix.map((step, index) => (
            <li key={`${index}-${step}`}>{step}</li>
          ))}
        </ol>
      </div>

      <div className="space-y-2">
        <h3 className="text-xs text-zinc-500">Justification</h3>
        <p className="break-words text-sm leading-relaxed text-zinc-500">
          {analysis.justification}
        </p>
      </div>
    </div>
  );
}

function AiAnalysisBody({
  state,
}: {
  state: ReturnType<typeof useAiAnalysis>["state"];
}) {
  if (state.status === "loading") {
    return (
      <div className="space-y-4">
        <p className="text-sm text-zinc-600">Generating analysis...</p>
        {state.preview && (
          <div className="opacity-40 transition-opacity duration-200">
            <AiAnalysisContent analysis={state.preview} />
          </div>
        )}
      </div>
    );
  }

  if (state.status === "success") {
    return <AiAnalysisContent analysis={state.data} />;
  }

  return (
    <div className="space-y-2">
      {state.error && (
        <p className="text-sm text-red-400/90">{state.error}</p>
      )}
      <p className="text-sm text-zinc-600">No AI analysis generated yet.</p>
    </div>
  );
}

export function IssueAiPanel({ issueId }: IssueAiPanelProps) {
  const { state, generate, isLoading } = useAiAnalysis(issueId);

  return (
    <div className="min-w-0 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <h2 className="text-xs font-medium uppercase tracking-wide text-zinc-500">
          AI Analysis
        </h2>
        <button
          type="button"
          onClick={generate}
          disabled={isLoading}
          className="shrink-0 rounded-md border border-white/[0.08] px-3 py-1.5 text-xs font-medium text-zinc-400 transition-colors hover:border-white/[0.15] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Generating..." : "Generate Analysis"}
        </button>
      </div>

      <div className="border-t border-white/[0.08] pt-5 transition-opacity duration-200">
        <AiAnalysisBody state={state} />
      </div>
    </div>
  );
}
