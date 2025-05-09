import React from "react";

import { DiffLine } from "~/components/diffing/DiffLine";
import {
  type DiffLine as DiffLineType,
  type DiffResult,
  DiffType,
} from "~/lib/algorithms";
import { cn } from "~/lib/utils";

interface SideBySideViewProps {
  diffResult: DiffResult;
  showLineNumbers?: boolean;
}

export function SideBySideView({
  diffResult,
  showLineNumbers = true,
}: SideBySideViewProps) {
  const { lines } = diffResult;

  const groupedLines = groupLinesForSideBySide(lines);

  return (
    <div className="flex flex-col rounded-md overflow-hidden border">
      {/* Header */}
      <div className="flex border-b bg-muted/30 text-sm font-medium">
        <div className="w-1/2 border-r p-2">Original</div>
        <div className="w-1/2 p-2">Modified</div>
      </div>

      {/* Diff content */}
      <div className="flex flex-col">
        {groupedLines.map((group, groupIndex) => (
          <div key={groupIndex} className="flex">
            {/* Left side (original) */}
            <div
              className={cn(
                "w-1/2 border-r",
                group.left?.type === DiffType.DELETED
                  ? "bg-red-50/30 dark:bg-red-950/10"
                  : "",
              )}
            >
              {group.left ? (
                <DiffLine line={group.left} showLineNumbers={showLineNumbers} />
              ) : (
                <div className="h-[1.625rem]"></div> // Empty placeholder with same height
              )}
            </div>

            {/* Right side (modified) */}
            <div
              className={cn(
                "w-1/2",
                group.right?.type === DiffType.ADDED
                  ? "bg-green-50/30 dark:bg-green-950/10"
                  : "",
              )}
            >
              {group.right ? (
                <DiffLine
                  line={group.right}
                  showLineNumbers={showLineNumbers}
                />
              ) : (
                <div className="h-[1.625rem]"></div> // Empty placeholder with same height
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function groupLinesForSideBySide(lines: DiffLineType[]): Array<{
  left: DiffLineType | null;
  right: DiffLineType | null;
}> {
  const result: Array<{
    left: DiffLineType | null;
    right: DiffLineType | null;
  }> = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    if (line.type === DiffType.UNCHANGED) {
      result.push({ left: line, right: line });
      i++;
    } else if (line.type === DiffType.DELETED) {
      if (i + 1 < lines.length && lines[i + 1].type === DiffType.ADDED) {
        result.push({ left: line, right: lines[i + 1] });
        i += 2;
      } else {
        result.push({ left: line, right: null });
        i++;
      }
    } else if (line.type === DiffType.ADDED) {
      result.push({ left: null, right: line });
      i++;
    } else {
      result.push({ left: line, right: line });
      i++;
    }
  }

  return result;
}
