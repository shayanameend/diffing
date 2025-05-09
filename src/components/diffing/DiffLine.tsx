import { MinusIcon, PlusIcon } from "lucide-react";
import React from "react";

import { type DiffLine as DiffLineType, DiffType } from "~/lib/algorithms";
import { cn } from "~/lib/utils";

interface DiffLineProps {
  line: DiffLineType;
  showLineNumbers?: boolean;
  isUnified?: boolean;
}

export function DiffLine({
  line,
  showLineNumbers = true,
  isUnified = false,
}: DiffLineProps) {
  const getBackgroundColor = () => {
    switch (line.type) {
      case DiffType.ADDED:
        return "bg-green-50 dark:bg-green-950/30 border-l-2 border-green-500 dark:border-green-600";
      case DiffType.DELETED:
        return "bg-red-50 dark:bg-red-950/30 border-l-2 border-red-500 dark:border-red-600";
      default:
        return "hover:bg-muted/30";
    }
  };

  const getLinePrefix = () => {
    if (!isUnified) return null;

    switch (line.type) {
      case DiffType.ADDED:
        return (
          <PlusIcon className="h-3.5 w-3.5 text-green-600 dark:text-green-400 mr-1" />
        );
      case DiffType.DELETED:
        return (
          <MinusIcon className="h-3.5 w-3.5 text-red-600 dark:text-red-400 mr-1" />
        );
      default:
        return (
          <span className="text-muted-foreground w-3.5 inline-block mr-1">
            {" "}
          </span>
        );
    }
  };

  const getTextColor = () => {
    switch (line.type) {
      case DiffType.ADDED:
        return "text-green-800 dark:text-green-300";
      case DiffType.DELETED:
        return "text-red-800 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <div
      className={cn(
        "flex font-mono text-sm whitespace-pre py-0.5 transition-colors",
        getBackgroundColor(),
      )}
    >
      {showLineNumbers && (
        <div className="flex min-w-[5rem] select-none text-muted-foreground border-r border-border">
          <div className="w-1/2 px-2 text-right">
            {line.oldLineNumber || " "}
          </div>
          <div className="w-1/2 px-2 text-right">
            {line.newLineNumber || " "}
          </div>
        </div>
      )}

      <div className={cn("flex-1 px-3 flex items-center", getTextColor())}>
        {isUnified && getLinePrefix()}
        <span className="overflow-x-auto">{line.content}</span>
      </div>
    </div>
  );
}
