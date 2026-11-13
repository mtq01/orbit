import type { AxeResults } from "./types";

// Every message the side panel sends to the content script lives here.
// The panel sends these, and content.ts reads them. Keeping them in one file
// means both sides agree on the exact shape of each message.

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

//Tool Tab - Highlight (See the Order)
export type HighlightMessage = {
  type: "RUN_HIGHLIGHT";
};

// carries back how many focusable stops were found
export type HighlightResponse = {
  success: boolean;
  count?: number;
};

export const HIGHLIGHT_MESSAGE: HighlightMessage = {
  type: "RUN_HIGHLIGHT",
};

//Tool Tab - Clear Highlight
export type ClearHighlightMessage = {
  type: "CLEAR_HIGHLIGHT_NUMBERS";
};

export const CLEAR_HIGHLIGHT_MESSAGE: ClearHighlightMessage = {
  type: "CLEAR_HIGHLIGHT_NUMBERS",
};
export type ClearAllMessage = {
  type: "CLEAR_ALL";
};

export const CLEAR_ALL_MESSAGE: ClearAllMessage = {
  type: "CLEAR_ALL",
};

//Tool Tab - High Contrast
export type HighContrastMessage = {
  type: "RUN_HIGH_CONTRAST";
  on: boolean;
};

export type HighContrastResponse = {
  success: boolean;
};

// this message carries an on/off value, so it's a small function instead of a fixed constant
export const highContrastMessage = (on: boolean): HighContrastMessage => ({
  type: "RUN_HIGH_CONTRAST",
  on,
});

// UNION: a message can be any ONE of these types.
// content.ts uses this so TypeScript knows which fields each message has after checking message.type.
export type PageMessage =
  | ScanMessage
  | HighlightEl
  | HighlightMessage
  | ClearHighlightMessage
  | ClearAllMessage
  | HighContrastMessage;
