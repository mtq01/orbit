import type { NodeResult } from "axe-core";

// Safeguard: locks the valid tab names, without this a typo like "scaner" would silently break the app with no error
// TypeScript catches this during build time, its a developer safety net.
export type Tab = "scanner" | "tools" | "colors" | "checklist";


export interface AxeResult {
    id: string;
    description: string;
    help: string;
    helpUrl: string;
    impact: "minor" | "moderate" | "serious" | "critical";
    // NodeResult[] = an array of NodeResult objects (DOM elements)
    nodes: NodeResult[];
}


export interface AxeResults{
    violations: AxeResult[];
    passes: AxeResult[];
    incomplete: AxeResult[];
}