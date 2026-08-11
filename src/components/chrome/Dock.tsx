"use client";

import { useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import {
  Briefcase,
  FileText,
  FolderKanban,
  House,
  Mail,
  UserRound,
} from "lucide-react";
import type { ComponentType } from "react";
import { SECTION_IDS, type SectionId } from "@/lib/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { profile } from "@/content/profile";

// lucide-react 1.0 removed all trademarked brand icons (Github, Linkedin, etc.) in favor of
// the separate Simple Icons project. Rather than adding a new dependency for two marks, they
// are inlined here using the standard Simple Icons path data.
type IconComponent = ComponentType<{ className?: string; strokeWidth?: number }>;

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

interface DockItem {
  id: string;
  label: string;
  icon: IconComponent;
  tint: string;
  action: { kind: "scroll"; target: SectionId } | { kind: "link"; href: string };
}

const NAV_ITEMS: DockItem[] = [
  { id: "home", label: "Home", icon: House, tint: "from-emerald-400 to-emerald-600", action: { kind: "scroll", target: "home" } },
  { id: "about", label: "About", icon: UserRound, tint: "from-sky-400 to-sky-600", action: { kind: "scroll", target: "about" } },
  { id: "experience", label: "Experience", icon: Briefcase, tint: "from-amber-400 to-amber-600", action: { kind: "scroll", target: "experience" } },
  { id: "projects", label: "Projects", icon: FolderKanban, tint: "from-violet-400 to-violet-600", action: { kind: "scroll", target: "projects" } },
  { id: "contact", label: "Contact", icon: Mail, tint: "from-rose-400 to-rose-600", action: { kind: "scroll", target: "contact" } },
];

const LINK_ITEMS: DockItem[] = [
  { id: "github", label: "GitHub", icon: GithubIcon, tint: "from-zinc-500 to-zinc-700", action: { kind: "link", href: profile.github } },
  { id: "linkedin", label: "LinkedIn", icon: LinkedinIcon, tint: "from-blue-400 to-blue-600", action: { kind: "link", href: profile.linkedin } },
  { id: "cv", label: "Download CV", icon: FileText, tint: "from-teal-400 to-teal-600", action: { kind: "link", href: profile.cvPath } },
];

export function Dock() {
  const mouseX = useMotionValue(Infinity);
  const active = useActiveSection(SECTION_IDS);

  return (
    <>
      <nav
        aria-label="Dock"
        onMouseMove={(e) => mouseX.set(e.clientX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="fixed bottom-3 left-1/2 z-50 hidden -translate-x-1/2 items-end gap-2 rounded-2xl border border-edge bg-surface-strong px-3 pb-2 pt-2 shadow-window backdrop-blur-xl md:flex"
      >
        {NAV_ITEMS.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} active={item.id === active} />
        ))}
        <span className="mx-1 h-10 w-px self-center bg-edge" aria-hidden="true" />
        {LINK_ITEMS.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} active={false} />
        ))}
      </nav>
      <MobileTabBar active={active} />
    </>
  );
}

function DockIcon({ item, mouseX, active }: { item: DockItem; mouseX: MotionValue<number>; active: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [bouncing, setBouncing] = useState(false);

  const distance = useTransform(mouseX, (x) => {
    const bounds = ref.current?.getBoundingClientRect();
    if (!bounds) return Infinity;
    return x - bounds.x - bounds.width / 2;
  });
  const size = useSpring(useTransform(distance, [-130, 0, 130], [44, 72, 44]), {
    mass: 0.1,
    stiffness: 190,
    damping: 13,
  });

  const Icon = item.icon;

  function activate() {
    if (item.action.kind === "link") {
      window.open(item.action.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (!reduce) setBouncing(true);
    document.getElementById(item.action.target)?.scrollIntoView();
  }

  return (
    <div ref={ref} className="group relative flex flex-col items-center">
      <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-edge bg-surface-strong px-2 py-0.5 text-xs text-ink opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
        {item.label}
      </span>
      <motion.button
        aria-label={item.label}
        onClick={activate}
        style={reduce ? { width: 44, height: 44 } : { width: size, height: size }}
        animate={bouncing ? { y: [0, -26, 0, -9, 0] } : { y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        onAnimationComplete={() => setBouncing(false)}
        className={`flex items-center justify-center rounded-xl bg-gradient-to-b ${item.tint} shadow-md`}
      >
        <Icon className="size-1/2 text-white" strokeWidth={1.8} />
      </motion.button>
      <span
        className={`mt-1 h-1 w-1 rounded-full bg-ink transition-opacity ${active ? "opacity-70" : "opacity-0"}`}
        aria-hidden="true"
      />
    </div>
  );
}

function MobileTabBar({ active }: { active: string }) {
  const tabs = NAV_ITEMS.filter((i) => i.id !== "home");
  return (
    <nav
      aria-label="Section tabs"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-4 border-t border-edge bg-surface-strong pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      {tabs.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            className={`flex flex-col items-center gap-0.5 py-2 text-[11px] ${isActive ? "text-accent" : "text-ink-muted"}`}
          >
            <Icon className="size-5" strokeWidth={1.8} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
