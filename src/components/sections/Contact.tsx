"use client";

import { ArrowUpRight, FileText } from "lucide-react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { profile } from "@/content/profile";

// lucide-react 1.0 removed all trademarked brand icons (Github, Linkedin, etc.) in favor of
// the separate Simple Icons project. Rather than adding a new dependency for two marks, they
// are inlined here using the standard Simple Icons path data.

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.333-1.755-1.333-1.755-1.089-.745.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.469-2.38 1.236-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

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
