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

  return (
    <button
      onClick={() => {
        playClick();
        setExpanded((e) => !e);
      }}
      aria-expanded={expanded}
      className="w-full rounded-lg border-l-4 bg-surface p-3 text-left transition-colors hover:bg-accent-soft"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center gap-3">
        <OrgBadge name={entry.organisation} logo={entry.logo} color={color} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{entry.role}</p>
          <p className="truncate text-xs" style={{ color }}>
            {entry.organisation}
          </p>
        </div>
        <div className="shrink-0 text-right font-mono text-[11px] text-ink-muted">
          {entry.location && <p>{entry.location}</p>}
          <p>{entry.period}</p>
        </div>
      </div>
      {expanded && (
        <ul className="mt-3 flex list-disc flex-col gap-1.5 pl-5 text-sm text-ink-muted marker:text-accent">
          {entry.highlights.map((h) => (
            <li key={h}>{h}</li>
          ))}
        </ul>
      )}
    </button>
  );
}

function OrgBadge({ name, logo, color }: { name: string; logo?: string; color: string }) {
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="" className="size-9 shrink-0 rounded-lg object-cover" />;
  }
  return (
    <span
      className="flex size-9 shrink-0 items-center justify-center rounded-lg text-sm font-bold text-white"
      style={{ backgroundColor: color }}
      aria-hidden="true"
    >
      {name.charAt(0)}
    </span>
  );
}
