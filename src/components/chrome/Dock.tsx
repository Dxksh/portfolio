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
  Images,
  Mail,
  UserRound,
} from "lucide-react";
import { SECTION_IDS, type SectionId } from "@/lib/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { profile } from "@/content/profile";
import { GithubIcon, LinkedinIcon, type IconComponent } from "@/components/icons";
import { useSound } from "@/components/SoundProvider";

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
  { id: "photos", label: "Photos", icon: Images, tint: "from-pink-400 to-pink-600", action: { kind: "scroll", target: "photos" } },
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
  const { playClick } = useSound();

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
    playClick();
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
  const { playClick } = useSound();
  return (
    <nav
      aria-label="Section tabs"
      className="fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-edge bg-surface-strong pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      {tabs.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <a
            key={item.id}
            href={`#${item.id}`}
            onClick={playClick}
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
