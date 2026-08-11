"use client";

import { Briefcase, GraduationCap } from "lucide-react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { experience, type ExperienceEntry } from "@/content/experience";

export function Experience() {
  const work = experience.filter((e) => e.kind === "work");
  const education = experience.filter((e) => e.kind === "education");

  return (
    <section id="experience" className="py-24">
      <Reveal>
        <SectionHeader eyebrow="02 · Experience" title="Where I've shipped" />
      </Reveal>
      <Reveal>
        <MacWindow title="Experience — Finder" contentClassName="p-0">
          <div className="flex">
            <aside className="hidden w-44 shrink-0 flex-col gap-1 border-r border-edge p-3 text-[13px] sm:flex">
              <p className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
                Favourites
              </p>
              <span className="flex items-center gap-2 rounded-md bg-accent-soft px-2 py-1">
                <Briefcase className="size-3.5 text-accent" /> Work
              </span>
              <span className="flex items-center gap-2 rounded-md px-2 py-1 text-ink-muted">
                <GraduationCap className="size-3.5" /> Education
              </span>
            </aside>
            <div className="min-w-0 flex-1 divide-y divide-edge">
              <FinderGroup label="Work" entries={work} />
              <FinderGroup label="Education" entries={education} />
            </div>
          </div>
        </MacWindow>
      </Reveal>
    </section>
  );
}

function FinderGroup({ label, entries }: { label: string; entries: ExperienceEntry[] }) {
  return (
    <div className="p-4 sm:p-5">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-wide text-ink-muted sm:hidden">
        {label}
      </p>
      <div className="flex flex-col gap-6">
        {entries.map((entry) => (
          <article key={entry.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-semibold">
                {entry.organisation} <span className="font-normal text-ink-muted">— {entry.role}</span>
              </h3>
              <p className="text-xs tabular-nums text-ink-muted">{entry.period}</p>
            </div>
            {entry.location && <p className="mt-0.5 text-xs text-ink-muted">{entry.location}</p>}
            <ul className="mt-2 flex list-disc flex-col gap-1.5 pl-5 text-sm text-ink-muted marker:text-accent">
              {entry.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </div>
  );
}
