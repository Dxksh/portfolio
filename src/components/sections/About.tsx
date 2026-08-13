"use client";

import { useState } from "react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Modal } from "@/components/Modal";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { Terminal } from "@/components/terminal/Terminal";
import { useSound } from "@/components/SoundProvider";
import { profile, skillGroups } from "@/content/profile";

export function About() {
  const [moreOpen, setMoreOpen] = useState(false);
  const { playClick } = useSound();

  return (
    <section id="about" className="py-24">
      <Reveal>
        <SectionHeader eyebrow="01 · About" title="Hello, world." />
      </Reveal>
      <Reveal>
        <div className="mb-6 flex flex-col gap-4 rounded-xl border border-edge bg-surface p-5 backdrop-blur sm:flex-row sm:items-center">
          {profile.headshot && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.headshot}
              alt={profile.name}
              className="size-16 shrink-0 rounded-full border border-edge object-cover"
            />
          )}
          <div>
            <p className="text-sm text-ink-muted">{profile.about}</p>
            <button
              onClick={() => {
                playClick();
                setMoreOpen(true);
              }}
              className="mt-2 text-sm font-medium text-accent hover:underline"
            >
              More about me →
            </button>
          </div>
        </div>
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
      <Modal
        open={moreOpen}
        onClose={() => {
          playClick();
          setMoreOpen(false);
        }}
        title="More About Daksh"
      >
        <p className="whitespace-pre-line text-sm text-ink-muted">{profile.moreAboutMe}</p>
      </Modal>
    </section>
  );
}
