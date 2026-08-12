import { describe, expect, it } from "vitest";
import {
  ACCENT_STORAGE_KEY,
  DEFAULT_ACCENT,
  isAccent,
  persistAccent,
  readStoredAccent,
  resolveInitialAccent,
} from "./accent";

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
}

describe("accent", () => {
  it("defaults to mint", () => {
    expect(DEFAULT_ACCENT).toBe("mint");
    expect(resolveInitialAccent(null)).toBe("mint");
  });

  it("keeps any valid stored value", () => {
    for (const a of ["mint", "ocean", "sunset", "berry"] as const) {
      expect(resolveInitialAccent(a)).toBe(a);
      expect(isAccent(a)).toBe(true);
    }
  });

  it("falls back to mint on junk values", () => {
    expect(resolveInitialAccent("teal")).toBe("mint");
    expect(isAccent("teal")).toBe(false);
    expect(isAccent(null)).toBe(false);
  });

  it("round-trips through storage", () => {
    const storage = memoryStorage();
    persistAccent(storage, "ocean");
    expect(storage.getItem(ACCENT_STORAGE_KEY)).toBe("ocean");
    expect(readStoredAccent(storage)).toBe("ocean");
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
    expect(readStoredAccent(broken)).toBe(DEFAULT_ACCENT);
    expect(() => persistAccent(broken, "berry")).not.toThrow();
  });
});
