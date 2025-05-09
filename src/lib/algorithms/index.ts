import type { DiffAlgorithm } from "./types";

import { LCSAlgorithm } from "./lcs";
import { TwoPointersAlgorithm } from "./twoPointers";

export * from "./types";

export { TwoPointersAlgorithm } from "./twoPointers";
export { LCSAlgorithm } from "./lcs";

export const twoPointersAlgorithm = new TwoPointersAlgorithm();
export const lcsAlgorithm = new LCSAlgorithm();

export const algorithms: DiffAlgorithm[] = [twoPointersAlgorithm, lcsAlgorithm];
