import { describe, expect, it } from "vitest";
import {
  DEFAULT_SOUND,
  SOUND_STORAGE_KEY,
  isSoundPreference,
  persistSound,
  readStoredSound,
  resolveInitialSound,
  toggleSound,
} from "./sound-preference";

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
}

describe("sound-preference", () => {
  it("defaults to on", () => {
    expect(DEFAULT_SOUND).toBe("on");
    expect(resolveInitialSound(null)).toBe("on");
  });

  it("keeps a valid stored value", () => {
    expect(resolveInitialSound("off")).toBe("off");
    expect(resolveInitialSound("on")).toBe("on");
  });

  it("falls back to on for junk values", () => {
    expect(resolveInitialSound("muted")).toBe("on");
    expect(isSoundPreference("muted")).toBe(false);
  });

  it("round-trips through storage", () => {
    const storage = memoryStorage();
    persistSound(storage, "off");
    expect(storage.getItem(SOUND_STORAGE_KEY)).toBe("off");
    expect(readStoredSound(storage)).toBe("off");
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
    expect(readStoredSound(broken)).toBe(DEFAULT_SOUND);
    expect(() => persistSound(broken, "off")).not.toThrow();
  });

  it("toggles between on and off", () => {
    expect(toggleSound("on")).toBe("off");
    expect(toggleSound("off")).toBe("on");
  });
});
