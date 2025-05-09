import {
  type DiffAlgorithm,
  type DiffLine,
  type DiffResult,
  DiffType,
} from "./types";

export class LCSAlgorithm implements DiffAlgorithm {
  name = "Longest Common Subsequence";

  diff(oldText: string, newText: string): DiffResult {
    const oldLines = oldText.split("\n");
    const newLines = newText.split("\n");

    const lcsMatrix = this.computeLCSMatrix(oldLines, newLines);

    const result = this.backtrack(
      lcsMatrix,
      oldLines,
      newLines,
      oldLines.length,
      newLines.length,
    );

    return {
      lines: result,
    };
  }

  /**
   * Compute the LCS matrix for two arrays of lines
   */
  private computeLCSMatrix(oldLines: string[], newLines: string[]): number[][] {
    const m = oldLines.length;
    const n = newLines.length;

    const matrix: number[][] = Array(m + 1)
      .fill(null)
      .map(() => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (oldLines[i - 1] === newLines[j - 1]) {
          matrix[i][j] = matrix[i - 1][j - 1] + 1;
        } else {
          matrix[i][j] = Math.max(matrix[i - 1][j], matrix[i][j - 1]);
        }
      }
    }

    return matrix;
  }

  /**
   * Backtrack through the LCS matrix to generate the diff
   */
  private backtrack(
    matrix: number[][],
    oldLines: string[],
    newLines: string[],
    i: number,
    j: number,
  ): DiffLine[] {
    const result: DiffLine[] = [];

    if (i === 0 && j === 0) {
      return result;
    }

    if (i > 0 && j > 0 && oldLines[i - 1] === newLines[j - 1]) {
      const prevResult = this.backtrack(
        matrix,
        oldLines,
        newLines,
        i - 1,
        j - 1,
      );
      prevResult.push({
        type: DiffType.UNCHANGED,
        content: oldLines[i - 1],
        oldLineNumber: i,
        newLineNumber: j,
      });
      return prevResult;
    }

    if (i > 0 && (j === 0 || matrix[i - 1][j] >= matrix[i][j - 1])) {
      const prevResult = this.backtrack(matrix, oldLines, newLines, i - 1, j);
      prevResult.push({
        type: DiffType.DELETED,
        content: oldLines[i - 1],
        oldLineNumber: i,
        newLineNumber: null,
      });
      return prevResult;
    }

    if (j > 0) {
      const prevResult = this.backtrack(matrix, oldLines, newLines, i, j - 1);
      prevResult.push({
        type: DiffType.ADDED,
        content: newLines[j - 1],
        oldLineNumber: null,
        newLineNumber: j,
      });
      return prevResult;
    }

    return result;
  }
}
