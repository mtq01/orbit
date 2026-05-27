// Safeguard: locks the valid tab names, without this a typo like "scaner" would silently break the app with no error
// TypeScript catches this during build time, its a developer safety net.
export type Tab = "scanner" | "tools" | "colors" | "checklist";
