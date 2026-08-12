"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import {
  DEFAULT_SOUND,
  persistSound,
  readStoredSound,
  toggleSound as toggleSoundPreference,
  type SoundPreference,
} from "@/lib/sound-preference";
import { playBlip } from "@/lib/sound";

interface SoundContextValue {
  soundEnabled: boolean;
  toggleSound: () => void;
  playClick: () => void;
}

const SoundContext = createContext<SoundContextValue | null>(null);

export function SoundProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState<SoundPreference>(DEFAULT_SOUND);

  useEffect(() => {
    // SSR-safe: reads a browser-only global (localStorage) once after mount, by design
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPreference(readStoredSound(window.localStorage));
  }, []);

  useEffect(() => {
    persistSound(window.localStorage, preference);
  }, [preference]);

  const soundEnabled = preference === "on";

  return (
    <SoundContext.Provider
      value={{
        soundEnabled,
        toggleSound: () => setPreference((p) => toggleSoundPreference(p)),
        playClick: () => {
          if (soundEnabled) playBlip();
        },
      }}
    >
      {children}
    </SoundContext.Provider>
  );
}

export function useSound(): SoundContextValue {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSound must be used inside SoundProvider");
  return ctx;
}
