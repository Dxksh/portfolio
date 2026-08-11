"use client";

import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Terminal } from "@/components/terminal/Terminal";
import { profile, skillGroups } from "@/content/profile";

export function About() {
  return (
    <section id="about" className="py-24">
      <Reveal>
        <SectionHeader eyebrow="01 · About" title="Hello, world." blurb={profile.about} />
      </Reveal>
      <div className="grid items-start gap-6 lg:grid-cols-2">
        <Reveal>
          <Terminal />
        </Reveal>
        <Reveal delay={0.12}>
          <MacWindow title="Skills — Overview">
            <div className="flex flex-col gap-5">
              {skillGroups.map((group) => (
                <div key={group.label}>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">
                    {group.label}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {group.items.map((item) => (
                      <li key={item} className="rounded-full border border-edge bg-surface px-2.5 py-1 text-xs">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </MacWindow>
        </Reveal>
      </div>
    </section>
  );
}
