"use client";

import { useEffect, useState } from "react";

const VISIBLE_MS = 900;
const FADE_MS = 300;

export function BootOverlay() {
  const [phase, setPhase] = useState<"visible" | "fading" | "gone">("visible");

  useEffect(() => {
    const fadeTimer = setTimeout(() => setPhase("fading"), VISIBLE_MS);
    const goneTimer = setTimeout(() => setPhase("gone"), VISIBLE_MS + FADE_MS);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (phase === "gone") return null;

  return (
    <button
      type="button"
      aria-label="Skip intro"
      onClick={() => setPhase("gone")}
      className={`fixed inset-0 z-[100] flex cursor-pointer items-center justify-center bg-[var(--wall-sky-2)] transition-opacity duration-300 ease-out motion-reduce:hidden ${
        phase === "fading" ? "opacity-0" : "opacity-100"
      }`}
    >
      <span className="animate-boot-in rounded-2xl bg-accent px-6 py-4 text-2xl font-bold tracking-tight text-white motion-reduce:animate-none">
        DS
      </span>
    </button>
  );
}
