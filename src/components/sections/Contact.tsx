"use client";

import { ArrowUpRight, FileText } from "lucide-react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon } from "@/components/icons";

const TILES = [
  { label: "GitHub", href: profile.github, icon: GithubIcon, external: true },
  { label: "LinkedIn", href: profile.linkedin, icon: LinkedinIcon, external: true },
  { label: "Download CV", href: profile.cvPath, icon: FileText, external: false },
];

export function Contact() {
  const mailHref = `mailto:${profile.email}?subject=${encodeURIComponent("Let's work together")}`;

  return (
    <section id="contact" className="pb-40 pt-24 md:pb-32">
      <Reveal>
        <SectionHeader eyebrow="04 · Contact" title="Get in touch" />
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
              return (
                <a
                  key={tile.label}
                  href={tile.href}
                  {...(tile.external
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : { download: true })}
                  className="group flex items-center justify-between rounded-xl border border-edge bg-surface p-4 backdrop-blur transition-colors hover:border-accent"
                >
                  <span className="flex items-center gap-3 text-sm font-medium">
                    <Icon className="size-4 text-accent" /> {tile.label}
                  </span>
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
