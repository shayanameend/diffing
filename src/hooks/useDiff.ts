import { useEffect, useState } from "react";

import {
  type DiffAlgorithm,
  type DiffResult,
  algorithms,
  lcsAlgorithm,
} from "~/lib/algorithms";

export function useDiff(
  oldText: string,
  newText: string,
  selectedAlgorithm: DiffAlgorithm = lcsAlgorithm,
) {
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!oldText && !newText) {
      setDiffResult(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    const timeoutId = setTimeout(() => {
      try {
        const result = selectedAlgorithm.diff(oldText, newText);
        setDiffResult(result);
      } catch (err) {
        console.error("Error computing diff:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
      } finally {
        setIsLoading(false);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [oldText, newText, selectedAlgorithm]);

  return {
    diffResult,
    isLoading,
    error,
    algorithms,
  };
}
