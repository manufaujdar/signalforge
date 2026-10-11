export type Platform = "X" | "LinkedIn" | "Instagram";
export type WorkspacePreferences = { platform: Platform; direction: number };
export const defaultPreferences: WorkspacePreferences = { platform: "X", direction: 0 };

export function parseWorkspacePreferences(value: string | null): WorkspacePreferences {
  try {
    const stored = JSON.parse(value || "null");
    if (stored && ["X", "LinkedIn", "Instagram"].includes(stored.platform) && [0, 1, 2].includes(stored.direction)) {
      return { platform: stored.platform, direction: stored.direction };
    }
  } catch { /* Use defaults when browser data is malformed. */ }
  return defaultPreferences;
}

export function preferencesSnapshot(): string | null {
  try { return localStorage.getItem("signalforge-workspace-preferences"); }
  catch { return null; }
}

export function subscribePreferences(notify: () => void) {
  window.addEventListener("storage", notify);
  return () => window.removeEventListener("storage", notify);
}
