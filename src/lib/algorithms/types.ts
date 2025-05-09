export enum DiffType {
  ADDED = "added",
  DELETED = "deleted",
  UNCHANGED = "unchanged",
}

export interface DiffLine {
  type: DiffType;
  content: string;
  oldLineNumber: number | null;
  newLineNumber: number | null;
}

export interface DiffResult {
  lines: DiffLine[];
}

export interface DiffAlgorithm {
  name: string;
  diff(oldText: string, newText: string): DiffResult;
}
