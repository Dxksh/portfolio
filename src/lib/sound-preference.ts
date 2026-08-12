export type SoundPreference = "on" | "off";

export const SOUND_STORAGE_KEY = "ds-sound";
export const DEFAULT_SOUND: SoundPreference = "on";

export function isSoundPreference(value: unknown): value is SoundPreference {
  return value === "on" || value === "off";
}

export function resolveInitialSound(stored: string | null): SoundPreference {
  return isSoundPreference(stored) ? stored : DEFAULT_SOUND;
}

export function readStoredSound(storage: Pick<Storage, "getItem">): SoundPreference {
  try {
    return resolveInitialSound(storage.getItem(SOUND_STORAGE_KEY));
  } catch {
    return DEFAULT_SOUND;
  }
}

export function persistSound(storage: Pick<Storage, "setItem">, sound: SoundPreference): void {
  try {
    storage.setItem(SOUND_STORAGE_KEY, sound);
  } catch {
    // storage unavailable (private mode) — preference still applies for this visit
  }
}

export function toggleSound(sound: SoundPreference): SoundPreference {
  return sound === "on" ? "off" : "on";
}
