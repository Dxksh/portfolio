"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { SECTIONS, SECTION_IDS } from "@/lib/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { useTheme } from "@/components/ThemeProvider";
import { profile } from "@/content/profile";

export function MenuBar() {
  const active = useActiveSection(SECTION_IDS);
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-9 items-center gap-5 border-b border-edge bg-surface-strong px-3 text-[13px] backdrop-blur-xl">
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          className="rounded px-1.5 py-0.5 font-semibold tracking-tight hover:bg-accent-soft"
        >
          DS
        </button>
        {menuOpen && (
          <>
            <button
              aria-label="Close menu"
              className="fixed inset-0 cursor-default"
              onClick={() => setMenuOpen(false)}
            />
            <div
              role="dialog"
              aria-label="About This Dev"
              className="absolute left-0 top-8 w-64 rounded-xl border border-edge bg-surface-strong p-4 shadow-window backdrop-blur-xl"
            >
              <p className="font-semibold">About This Dev</p>
              <p className="mt-1 text-xs text-ink-muted">
                DakshOS 26.08 &ldquo;Liverpool&rdquo; — one careful owner, ships weekly.
              </p>
              <div className="mt-3 flex flex-col gap-1.5 text-xs">
                <a className="hover:text-accent" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                <a className="hover:text-accent" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                <a className="hover:text-accent" href={profile.cvPath} download>Download CV</a>
                <a className="hover:text-accent" href={`mailto:${profile.email}`}>Email me</a>
              </div>
            </div>
          </>
        )}
      </div>
      <nav aria-label="Sections" className="hidden gap-4 md:flex">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={s.id === active ? "font-semibold text-ink" : "text-ink-muted transition-colors hover:text-ink"}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded p-1 hover:bg-accent-soft"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <Clock />
      </div>
    </header>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return <span className="inline-block w-28" aria-hidden="true" />;

  const date = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <time className="tabular-nums text-ink-muted">
      <span className="hidden sm:inline">{date} </span>
      {time}
    </time>
  );
}
