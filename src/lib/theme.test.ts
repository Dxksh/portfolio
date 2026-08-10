import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  persistTheme,
  readStoredTheme,
  resolveInitialTheme,
  toggleTheme,
} from "./theme";

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
}

describe("theme", () => {
  it("defaults to dark", () => {
    expect(DEFAULT_THEME).toBe("dark");
    expect(resolveInitialTheme(null)).toBe("dark");
  });

  it("keeps a valid stored value", () => {
    expect(resolveInitialTheme("light")).toBe("light");
    expect(resolveInitialTheme("dark")).toBe("dark");
  });

  it("falls back to dark on junk values", () => {
    expect(resolveInitialTheme("neon")).toBe("dark");
  });

  it("round-trips through storage", () => {
    const storage = memoryStorage();
    persistTheme(storage, "light");
    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(readStoredTheme(storage)).toBe("light");
  });

  it("survives a throwing storage", () => {
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    };
    expect(readStoredTheme(broken)).toBe(DEFAULT_THEME);
    expect(() => persistTheme(broken, "light")).not.toThrow();
  });

  it("toggles between themes", () => {
    expect(toggleTheme("dark")).toBe("light");
    expect(toggleTheme("light")).toBe("dark");
  });
});
