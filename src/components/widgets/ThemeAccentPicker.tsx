"use client";

import { Check } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useSound } from "@/components/SoundProvider";
import type { Accent } from "@/lib/accent";

const ACCENTS: { id: Accent; label: string; swatch: string }[] = [
  { id: "mint", label: "Mint", swatch: "#34c759" },
  { id: "ocean", label: "Ocean", swatch: "#0a84ff" },
  { id: "sunset", label: "Sunset", swatch: "#ff9f0a" },
  { id: "berry", label: "Berry", swatch: "#bf5af2" },
];

export function ThemeAccentPicker() {
  const { theme, accent, setAccent } = useTheme();
  const { playClick } = useSound();
  const disabled = theme !== "dark";

  return (
    <div className="flex h-full flex-col justify-between rounded-xl border border-edge bg-surface p-4 backdrop-blur">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">Choose an accent</p>
      <div className="mt-3 flex gap-3">
        {ACCENTS.map((a) => (
          <button
            key={a.id}
            onClick={() => {
              playClick();
              setAccent(a.id);
            }}
            disabled={disabled}
            aria-label={`Switch to ${a.label} accent`}
            aria-pressed={accent === a.id}
            className="relative flex size-8 items-center justify-center rounded-full border border-edge disabled:cursor-not-allowed disabled:opacity-40"
            style={{ backgroundColor: a.swatch }}
          >
            {accent === a.id && !disabled && <Check className="size-4 text-white" strokeWidth={3} />}
          </button>
        ))}
      </div>
      {disabled && <p className="mt-2 text-[11px] text-ink-muted">Accents apply in dark mode</p>}
    </div>
  );
}
