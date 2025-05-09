import React from "react";

import { DiffLine } from "~/components/diffing/DiffLine";
import type { DiffResult } from "~/lib/algorithms";

interface UnifiedViewProps {
  diffResult: DiffResult;
  showLineNumbers?: boolean;
}

export function UnifiedView({
  diffResult,
  showLineNumbers = true,
}: UnifiedViewProps) {
  const { lines } = diffResult;

  return (
    <div className="flex flex-col border rounded-md overflow-hidden">
      <div className="bg-muted/30 border-b p-2 font-medium">Unified View</div>

      <div className="flex flex-col">
        {lines.map((line, index) => (
          <DiffLine
            key={index}
            line={line}
            showLineNumbers={showLineNumbers}
            isUnified={true}
          />
        ))}
      </div>
    </div>
  );
}
