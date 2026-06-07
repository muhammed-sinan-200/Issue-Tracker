"use client";

import { useCallback, useRef, useState } from "react";
import { generateAIAnalysis } from "@/services/api";
import type { AiAnalysis } from "@/types/issue";

export type AiAnalysisState =
  | { status: "empty"; error?: string }
  | { status: "loading"; preview?: AiAnalysis }
  | { status: "success"; data: AiAnalysis };

const INITIAL_STATE: AiAnalysisState = { status: "empty" };

export function useAiAnalysis(issueId: string) {
  const [state, setState] = useState<AiAnalysisState>(INITIAL_STATE);
  const requestIdRef = useRef(0);

  const generate = useCallback(async () => {
    const requestId = ++requestIdRef.current;

    setState((current) => ({
      status: "loading",
      preview: current.status === "success" ? current.data : undefined,
    }));

    try {
      const data = await generateAIAnalysis(issueId);

      if (requestId !== requestIdRef.current) {
        return;
      }

      setState({ status: "success", data });
    } catch (err) {
      if (requestId !== requestIdRef.current) {
        return;
      }

      setState({
        status: "empty",
        error:
          err instanceof Error
            ? err.message
            : "Failed to generate analysis. Try again.",
      });
    }
  }, [issueId]);

  return { state, generate, isLoading: state.status === "loading" };
}
