import React, { useRef } from "react";

import { SideBySideView } from "~/components/diffing/SideBySideView";
import { UnifiedView } from "~/components/diffing/UnifiedView";
import { useDiff } from "~/hooks/useDiff";
import { type DiffAlgorithm, lcsAlgorithm } from "~/lib/algorithms";

interface DiffViewerProps {
  oldText: string;
  newText: string;
  algorithm?: DiffAlgorithm;
  viewMode?: "side-by-side" | "unified";
  showLineNumbers?: boolean;
}

export function DiffViewer({
  oldText,
  newText,
  algorithm = lcsAlgorithm,
  viewMode = "side-by-side",
  showLineNumbers = true,
}: DiffViewerProps) {
  const diffContainerRef = useRef<HTMLDivElement>(null);

  const { diffResult, isLoading, error } = useDiff(oldText, newText, algorithm);

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col md:flex-row h-[600px] rounded-md overflow-hidden">
        <div className="flex-1 overflow-auto" ref={diffContainerRef}>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {error && (
            <div className="flex items-center justify-center h-full text-red-500">
              Error: {error.message}
            </div>
          )}

          {!isLoading && !error && diffResult && (
            <>
              {viewMode === "side-by-side" ? (
                <SideBySideView
                  diffResult={diffResult}
                  showLineNumbers={showLineNumbers}
                />
              ) : (
                <UnifiedView
                  diffResult={diffResult}
                  showLineNumbers={showLineNumbers}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
