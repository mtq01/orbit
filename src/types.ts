import type { NodeResult } from "axe-core";

// TYPE: a value that can only be one of these exact strings. nothing else is allowed.
// if you typo "scaner" anywhere in the app, TypeScript catches it before it runs.
export type Tab = "scanner" | "tools" | "colors" | "checklist";
export type FilterTab = "all" | "critical" | "serious" | "moderate";

// INTERFACE: describes the shape of an object. every AxeResult must have all these properties.
// think of it like a contract. if any property is missing or the wrong type, TypeScript errors.
export interface AxeResult {
  id: string;
  description: string;
  help: string;
  helpUrl: string;
  impact: "moderate" | "serious" | "critical";
  // NodeResult[] = an array of NodeResult objects (DOM elements)
  nodes: NodeResult[];
}

export interface AxeResults {
  violations: AxeResult[];
  // passes: AxeResult[];
  // incomplete: AxeResult[];
}
//Scan Tab
export type ScanMessage = {
  type: "RUN_SCAN";
};

export type HighlightEl = {
  type: "HighlightEl";
  selector: string;
};

export type ScanResponse = {
  success: boolean;
  results: AxeResults;
};
// CONSTANT: an actual value we reuse in code. not a blueprint, a real object.
// we define it once here so we never have to type { type: "RUN_SCAN" } by hand and risk a typo.
export const SCAN_MESSAGE: ScanMessage = {
  type: "RUN_SCAN",
};

//Tool Tab
export type HighlightMessage = {
  type: "RUN_HIGHLIGHT";
};

export type HighlightResponse = {
  success: boolean;
};

export const HIGHLIGHT_MESSAGE: HighlightMessage = {
  type: "RUN_HIGHLIGHT"
}

export type HighContrastMessage = {
  type: "RUN_HIGH_CONTRAST";
};

export const HIGH_CONTRAST_MESSAGE: HighContrastMessage = {
  type: "RUN_HIGH_CONTRAST"
};
