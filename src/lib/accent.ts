export type Accent = "mint" | "ocean" | "sunset" | "berry";

export const ACCENT_STORAGE_KEY = "ds-accent";
export const DEFAULT_ACCENT: Accent = "mint";

export function isAccent(value: unknown): value is Accent {
  return value === "mint" || value === "ocean" || value === "sunset" || value === "berry";
}

export function resolveInitialAccent(stored: string | null): Accent {
  return isAccent(stored) ? stored : DEFAULT_ACCENT;
}

export function readStoredAccent(storage: Pick<Storage, "getItem">): Accent {
  try {
    return resolveInitialAccent(storage.getItem(ACCENT_STORAGE_KEY));
  } catch {
    return DEFAULT_ACCENT;
  }
}

export function persistAccent(storage: Pick<Storage, "setItem">, accent: Accent): void {
  try {
    storage.setItem(ACCENT_STORAGE_KEY, accent);
  } catch {
    // storage unavailable (private mode) — accent still applies for this visit
  }
}
