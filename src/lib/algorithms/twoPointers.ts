import {
  type DiffAlgorithm,
  type DiffLine,
  type DiffResult,
  DiffType,
} from "./types";

export class TwoPointersAlgorithm implements DiffAlgorithm {
  name = "Two Pointers";

  diff(oldText: string, newText: string): DiffResult {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");

    const result: DiffLine[] = [];
    let oldIndex = 0;
    let newIndex = 0;

    while (oldIndex < oldLines.length || newIndex < newLines.length) {
      if (oldIndex >= oldLines.length) {
        result.push({
          type: DiffType.ADDED,
          content: newLines[newIndex],
          oldLineNumber: null,
          newLineNumber: newIndex + 1,
        });
        newIndex++;
        continue;
      }

      if (newIndex >= newLines.length) {
        result.push({
          type: DiffType.DELETED,
          content: oldLines[oldIndex],
          oldLineNumber: oldIndex + 1,
          newLineNumber: null,
        });
        oldIndex++;
        continue;
      }

      if (oldLines[oldIndex] === newLines[newIndex]) {
        result.push({
          type: DiffType.UNCHANGED,
          content: oldLines[oldIndex],
          oldLineNumber: oldIndex + 1,
          newLineNumber: newIndex + 1,
        });
        oldIndex++;
        newIndex++;
      } else {
        const nextOldIndex = oldIndex + 1;
        const nextNewIndex = newIndex + 1;

        if (
          nextOldIndex < oldLines.length &&
          oldLines[nextOldIndex] === newLines[newIndex]
        ) {
          result.push({
            type: DiffType.DELETED,
            content: oldLines[oldIndex],
            oldLineNumber: oldIndex + 1,
            newLineNumber: null,
          });
          oldIndex++;
        } else if (
          nextNewIndex < newLines.length &&
          oldLines[oldIndex] === newLines[nextNewIndex]
        ) {
          result.push({
            type: DiffType.ADDED,
            content: newLines[newIndex],
            oldLineNumber: null,
            newLineNumber: newIndex + 1,
          });
          newIndex++;
        } else {
          result.push({
            type: DiffType.DELETED,
            content: oldLines[oldIndex],
            oldLineNumber: oldIndex + 1,
            newLineNumber: null,
          });

          result.push({
            type: DiffType.ADDED,
            content: newLines[newIndex],
            oldLineNumber: null,
            newLineNumber: newIndex + 1,
          });

          oldIndex++;
          newIndex++;
        }
      }
    }

    return {
      lines: result,
    };
  }
}
