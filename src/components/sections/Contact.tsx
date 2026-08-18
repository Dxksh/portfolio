"use client";

import { ArrowUpRight, Eye, Maximize2 } from "lucide-react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { useResume } from "@/components/ResumeProvider";
import { useSound } from "@/components/SoundProvider";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon, type IconComponent } from "@/components/icons";

// No separate download tile — the résumé window carries its own Download button.
type Tile = { label: string; icon: IconComponent } & (
  | { kind: "external"; href: string }
  | { kind: "resume" }
);

const TILES: Tile[] = [
  { label: "GitHub", kind: "external", href: profile.github, icon: GithubIcon },
  { label: "LinkedIn", kind: "external", href: profile.linkedin, icon: LinkedinIcon },
  { label: "View resume", kind: "resume", icon: Eye },
];

const TILE_CLASS =
  "group flex items-center justify-between rounded-xl border border-edge bg-surface p-4 backdrop-blur transition-colors hover:border-accent";

export function Contact() {
  const mailHref = `mailto:${profile.email}?subject=${encodeURIComponent("Let's work together")}`;
  const { openResume } = useResume();
  const { playClick } = useSound();

  return (
    <section id="contact" className="pb-40 pt-24 md:pb-32">
      <Reveal>
        <SectionHeader eyebrow="05 · Contact" title="Get in touch" />
      </Reveal>
      <div className="grid items-start gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Reveal>
          <MacWindow title="New Message" contentClassName="p-0">
            <div className="border-b border-edge px-4 py-2 text-sm">
              <span className="text-ink-muted">To: </span>
              {`${profile.name} <${profile.email}>`}
            </div>
            <div className="border-b border-edge px-4 py-2 text-sm">
              <span className="text-ink-muted">Subject: </span>Let&apos;s work together
            </div>
            <div className="px-4 py-4 text-sm text-ink-muted">
              <p>Hi Daksh,</p>
              <p className="mt-2">
                We&apos;re hiring Software Engineers and your portfolio caught our eye…
              </p>
            </div>
            <div className="flex justify-end border-t border-edge px-4 py-3">
              <a
                href={mailHref}
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Send ↗
              </a>
            </div>
          </MacWindow>
        </Reveal>
        <Reveal delay={0.12}>
          <div className="flex flex-col gap-3">
            {TILES.map((tile) => {
              const Icon = tile.icon;
              const label = (
                <span className="flex items-center gap-3 text-sm font-medium">
                  <Icon className="size-4 text-accent" /> {tile.label}
                </span>
              );

              if (tile.kind === "resume") {
                return (
                  <button
                    key={tile.label}
                    type="button"
                    onClick={() => {
                      playClick();
                      openResume();
                    }}
                    className={`${TILE_CLASS} w-full text-left`}
                  >
                    {label}
                    <Maximize2
                      className="size-4 text-ink-muted transition-transform group-hover:scale-110"
                      aria-hidden="true"
                    />
                  </button>
                );
              }

              return (
                <a
                  key={tile.label}
                  href={tile.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={TILE_CLASS}
                >
                  {label}
                  <ArrowUpRight className="size-4 text-ink-muted transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              );
            })}
          </div>
        </Reveal>
      </div>
      <footer className="mt-16 text-center text-xs text-ink-muted">
        © 2026 {profile.name} · Built with Next.js · Designed like a Mac
      </footer>
    </section>
  );
}
