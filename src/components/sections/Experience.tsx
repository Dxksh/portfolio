"use client";

import { useState } from "react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { useSound } from "@/components/SoundProvider";
import { experience, type ExperienceEntry } from "@/content/experience";

const TABS: { kind: ExperienceEntry["kind"]; label: string }[] = [
  { kind: "work", label: "--work" },
  { kind: "leadership", label: "--leadership" },
  { kind: "education", label: "--education" },
];

const BORDER_COLORS = ["#34c759", "#ff375f", "#0a84ff", "#ffd60a", "#bf5af2"];

export function Experience() {
  const [activeTab, setActiveTab] = useState<ExperienceEntry["kind"]>("work");
  const { playClick } = useSound();
  const entries = experience.filter((e) => e.kind === activeTab);

  return (
    <section id="experience" className="py-24">
      <Reveal>
        <SectionHeader eyebrow="02 · Experience" title="Where I've shipped" />
      </Reveal>
      <Reveal>
        <MacWindow title="experience.log — zsh" contentClassName="p-0">
          <div className="flex gap-4 border-b border-edge px-4 pt-3 font-mono text-sm">
            {TABS.map((tab) => (
              <button
                key={tab.kind}
                onClick={() => {
                  playClick();
                  setActiveTab(tab.kind);
                }}
                aria-pressed={activeTab === tab.kind}
                className={`pb-2 ${
                  activeTab === tab.kind
                    ? "border-b-2 border-accent font-semibold text-ink"
                    : "text-ink-muted hover:text-ink"
                }`}
              >
                [{tab.label}]
              </button>
            ))}
          </div>
          <div className="p-4 sm:p-5">
            <p className="mb-4 font-mono text-xs text-ink-muted">$ cat experience.log</p>
            <div className="flex flex-col gap-3">
              {entries.map((entry, i) => (
                <ExperienceCard key={entry.id} entry={entry} color={BORDER_COLORS[i % BORDER_COLORS.length]} />
              ))}
            </div>
          </div>
        </MacWindow>
      </Reveal>
    </section>
  );
}

function ExperienceCard({ entry, color }: { entry: ExperienceEntry; color: string }) {
  const [expanded, setExpanded] = useState(false);
  const { playClick } = useSound();
  const highlightsId = `${entry.id}-highlights`;

  return (
    <div className="rounded-lg border-l-4 bg-surface transition-colors hover:bg-accent-soft" style={{ borderLeftColor: color }}>
      <button
        onClick={() => {
          playClick();
          setExpanded((e) => !e);
        }}
        aria-expanded={expanded}
        aria-controls={highlightsId}
        className="w-full p-4 text-left sm:p-5"
      >
        <div className="flex items-center gap-4">
          <OrgBadge name={entry.organisation} logo={entry.logo} color={color} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-base font-semibold">{entry.role}</p>
            <p className="truncate text-sm text-ink-muted">{entry.organisation}</p>
          </div>
          {/* 11px on phones only: at 375px the wider mono column would squeeze the
              truncated role/org text down to a couple of characters. */}
          <div className="shrink-0 text-right font-mono text-[11px] text-ink-muted sm:text-xs">
            {entry.location && <p>{entry.location}</p>}
            <p>{entry.period}</p>
          </div>
        </div>
      </button>
      {/*
        pl aligns the bullets with the text column above them:
        card padding + badge + header gap = 16 + 48 + 16 = 80px (pl-20),
        and 20 + 48 + 16 = 84px once the padding steps up at sm (pl-21).
      */}
      <ul
        id={highlightsId}
        hidden={!expanded}
        className="flex list-disc flex-col gap-2 px-4 pb-4 pl-20 text-sm text-ink-muted marker:text-accent sm:px-5 sm:pb-5 sm:pl-21"
      >
        {entry.highlights.map((h, i) => (
          <li key={`${entry.id}-${i}`}>{h}</li>
        ))}
      </ul>
    </div>
  );
}

function OrgBadge({ name, logo, color }: { name: string; logo?: string; color: string }) {
  if (logo) {
    // Real company logos are rarely square and usually dark-on-transparent, so contain
    // them (never crop) on a light plate that keeps them legible in both themes.
    // Plain <img> is deliberate: this app is a static export, so next/image would only
    // run unoptimized anyway — matches About.tsx / Photos.tsx.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logo}
        alt=""
        width={48}
        height={48}
        className="size-12 shrink-0 rounded-lg border border-edge bg-white/90 object-contain p-1"
      />
    );
  }
  return (
    <span
      className="flex size-12 shrink-0 items-center justify-center rounded-lg text-lg font-bold text-black"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  );
}
