# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy Daksh Singhvi's macOS-desktop-themed portfolio one-pager per the approved spec at `docs/superpowers/specs/2026-08-10-portfolio-website-design.md`.

**Architecture:** A fully static Next.js App Router site (single route, `output: "export"`), rendered as a "desktop": a fixed SVG wallpaper behind everything, a fixed menu bar (top) and dock (bottom), and five scrollable sections whose content lives in mac-style windows. All copy lives in `src/content/*.ts` data files. Theme (dark "Night Hills" default / light "Day Hills") is a `data-theme` attribute on `<html>` driving CSS variables, persisted to `localStorage`.

**Tech Stack:** Next.js (App Router, static export) · Tailwind CSS v4 · Motion (`motion` package, imported from `"motion/react"`) · lucide-react icons · Vitest (unit) · Playwright (e2e) · Vercel.

## Global Constraints

- **Section order (spec §3):** Hero → About → Experience → Projects → Contact. Dock icons and scrollspy follow this order.
- **Theme:** dark default, light toggle, persisted in `localStorage` under key `ds-theme`. No flash of wrong theme on load.
- **Accent:** mint green `#34c759` family (light mode uses a darker green for contrast).
- **All copy in `src/content/*.ts`** — components never hard-code user-facing text about Daksh. CV PDF served from `public/cv/Daksh-Singhvi-CV.pdf`.
- **Motion discipline (spec §4):** `prefers-reduced-motion` honoured everywhere; animate only `transform`/`opacity` (color/background transitions for the theme crossfade are allowed).
- **Mobile <768px:** slim menu bar, 4-icon fixed tab bar instead of dock, windows/terminal as static cards (no drag, no magnification).
- **No Apple-copyrighted assets** — all visuals are custom CSS/SVG.
- **Lighthouse ≥90 in all categories** before deploy (Task 15).
- **Repo:** public GitHub `Dxksh/portfolio`, Vercel auto-deploy from `main`.
- **Package manager:** npm. Run all commands from the repo root `/Users/daksh/Desktop/Development/Projects/portfolio`.
- **Provisional content:** values marked `// PROVISIONAL` in content files are best-known guesses; the user does a final copy pass after build (spec §7). Do not block on them.

---

### Task 1: Scaffold Next.js app with static export

**Files:**
- Create: entire Next.js scaffold at repo root (`package.json`, `src/app/*`, `tsconfig.json`, etc.)
- Modify: `next.config.ts`, `.gitignore`, `package.json`

**Interfaces:**
- Consumes: nothing (first task).
- Produces: a building Next.js app; `npm run build` emits static site to `out/`; path alias `@/*` → `src/*`.

- [ ] **Step 1: Scaffold into a temp dir and merge into repo root**

`create-next-app` refuses directories containing `.superpowers/`, so scaffold beside it and merge:

```bash
cd /Users/daksh/Desktop/Development/Projects/portfolio
npx create-next-app@latest scaffold-tmp --yes --ts --tailwind --eslint --app --src-dir --use-npm
rm -rf scaffold-tmp/.git scaffold-tmp/node_modules
rsync -a scaffold-tmp/ ./
rm -rf scaffold-tmp
```

- [ ] **Step 2: Fix package name, merge .gitignore, install**

In `package.json`, change `"name": "scaffold-tmp"` to `"name": "portfolio"`.

The scaffold's `.gitignore` overwrote ours — re-append our entries:

```bash
printf '\n# project\n.superpowers/\n.DS_Store\n' >> .gitignore
npm install
```

- [ ] **Step 3: Configure static export**

Replace `next.config.ts` with:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 4: Verify the static build**

Run: `npm run build`
Expected: build succeeds and `ls out/index.html` shows the file exists.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: scaffold Next.js app with Tailwind and static export"
```

---

### Task 2: Content data files + CV PDF

**Files:**
- Create: `src/content/profile.ts`, `src/content/experience.ts`, `src/content/projects.ts`, `public/cv/Daksh-Singhvi-CV.pdf`

**Interfaces:**
- Consumes: nothing.
- Produces (exact exports later tasks import):
  - `profile.ts`: `profile` object (`name`, `role`, `summary`, `about`, `availability`, `location`, `email`, `github`, `linkedin`, `cvPath` — all `string`), `skillGroups: readonly { label: string; items: readonly string[] }[]`
  - `experience.ts`: `type ExperienceEntry`, `experience: ExperienceEntry[]`
  - `projects.ts`: `type Project`, `featuredProjects: Project[]`, `miniProjects: { name: string; tagline: string; href: string }[]`

- [ ] **Step 1: Write `src/content/profile.ts`**

```ts
export const profile = {
  name: "Daksh Singhvi",
  role: "Software Engineer",
  summary:
    "CS graduate with 1+ years shipping scalable systems at Sentric Music — immediately available for Software Engineering roles.",
  about:
    "I'm a Computer Science graduate from the University of Liverpool with 1+ years of professional experience at Sentric Music — from 10-million-record batch jobs on AWS to full-stack features used across the business. Right now I'm looking for my next Software Engineering role.",
  availability: "Available for work",
  location: "Liverpool, UK",
  email: "dsinghvi07@gmail.com",
  github: "https://github.com/Dxksh",
  linkedin: "https://www.linkedin.com/in/daksh-singhvi",
  cvPath: "/cv/Daksh-Singhvi-CV.pdf",
} as const;

export const skillGroups = [
  {
    label: "Languages",
    items: ["C#", "Java", "Python", "JavaScript", "TypeScript", "Swift", "Dart", "SQL", "HTML/CSS", "C", "C++"],
  },
  {
    label: "Frameworks & Libraries",
    items: [".NET", "ASP.NET MVC", "Entity Framework", "React", "Next.js", "Flutter", "Firebase"],
  },
  {
    label: "Cloud & Databases",
    items: ["AWS Batch", "AWS Lambda", "S3", "MySQL", "Vercel"],
  },
  {
    label: "Tools & Practices",
    items: ["Git", "Docker", "Agile / Scrum / Kanban", "REST & Swagger APIs", "SOLID", "Claude Code", "GitHub Copilot", "Xcode", "Android Studio"],
  },
] as const;
```

- [ ] **Step 2: Write `src/content/experience.ts`**

```ts
export interface ExperienceEntry {
  id: string;
  kind: "work" | "education";
  organisation: string;
  role: string;
  location?: string;
  period: string;
  highlights: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "sentric",
    kind: "work",
    organisation: "Sentric Music",
    role: "Associate Software Engineer",
    location: "Liverpool, UK",
    period: "Sept 2024 – Sept 2025",
    highlights: [
      "Built scalable batch and bulk data jobs with C#, .NET, Entity Framework and AWS Batch/Lambda — validating and updating 10M+ artist records per run with optimised SQL (CTEs, indexes)",
      "Shipped full-stack features across Sentric's websites — search filters, reporting tools and new page rollouts — with C#, .NET, MySQL, JavaScript and HTML/CSS, following MVC and SOLID",
      "Owned end-to-end delivery in an Agile/Kanban team, including a nightly database health-check system and bulk import tooling used by 150+ internal users",
      "Integrated GitHub Copilot and Claude into daily workflows for code design and peer review, contributing to 100+ PRs",
    ],
  },
  {
    id: "al-futtaim",
    kind: "work",
    organisation: "Al Futtaim Group — Blue Rewards",
    role: "Technology and Data Intern",
    location: "Dubai, UAE",
    period: "July 2024 – Sept 2024",
    highlights: [
      "Built a cross-platform Flutter receipt-scanning app integrating GPT-4o and Google ML Kit to automate receipt data extraction for the Blue Rewards loyalty programme",
      "Migrated a customer analytics dashboard from Power BI to Microsoft Power Apps, scaling to serve 2M+ users with insights into behaviour, spending and engagement",
    ],
  },
  {
    id: "liverpool",
    kind: "education",
    organisation: "University of Liverpool",
    role: "BSc Computer Science with Software Development",
    location: "Liverpool, UK",
    period: "Sept 2022 – June 2026",
    highlights: [
      "First Class Honours, including a cohort-highest 99% in the Software Engineering module exam",
      "Vice-Chancellor International Attainment Scholarship awardee",
      "Coursework: Data Structures & Algorithms, Software Engineering, AI, Data Science, iOS Development, Big Data, Cloud Computing",
    ],
  },
];
```

- [ ] **Step 3: Write `src/content/projects.ts`**

```ts
import { profile } from "./profile";

export interface Project {
  id: string;
  name: string;
  impact?: string; // one-line proof of impact, shown first (accent)
  description: string;
  tech: string[];
  links: { label: string; href: string; external: boolean }[];
}

export const featuredProjects: Project[] = [
  {
    id: "numble",
    name: "Numble",
    impact: "Real-time multiplayer — two players race live to crack each other's 5-digit codes",
    description:
      "Wordle-inspired multiplayer web game with live game-state sync, shareable lobby links, anonymous auth and full mobile support. Built and shipped end to end.",
    tech: ["React 19", "TypeScript", "Firebase", "Vercel"],
    links: [
      { label: "Live demo", href: "https://duelle-game.vercel.app/", external: true },
      { label: "GitHub", href: "https://github.com/Dxksh/duelle", external: true },
    ],
  },
  {
    id: "padelo",
    name: "Padelo",
    impact: "Published on the Play Store (internal release)",
    description:
      "Cross-platform padel scoring and social app — score tracking, social groups, tournaments and detailed statistics, built with Claude Code agentic workflows.",
    tech: ["Flutter", "Dart", "Firebase", "Claude Code"],
    links: [
      { label: "Private repo — request access", href: `mailto:${profile.email}?subject=Padelo%20repo%20access`, external: false },
    ],
  },
  {
    id: "deepfake-detector",
    name: "Music Deepfake Detector",
    // PROVISIONAL — description/tech/link to be confirmed in the user copy pass
    description:
      "Machine-learning classifier that detects AI-generated music from audio features — university research project.",
    tech: ["Python", "Machine Learning"],
    links: [{ label: "GitHub", href: profile.github, external: true }],
  },
  {
    id: "robot-mapper",
    name: "Autonomous Robot Mapper",
    // PROVISIONAL — description/tech/link to be confirmed in the user copy pass
    description:
      "Autonomous robot that explores and maps unknown environments — navigation, obstacle avoidance and mapping logic.",
    tech: ["Python", "Robotics"],
    links: [{ label: "GitHub", href: profile.github, external: true }],
  },
];

export const miniProjects = [
  { name: "react-storefront", tagline: "E-commerce storefront in React", href: "https://github.com/Dxksh/react-storefront" },
  { name: "SimonGame", tagline: "Classic memory game for the browser", href: "https://github.com/Dxksh/SimonGame" },
];
```

- [ ] **Step 4: Copy the CV PDF**

```bash
mkdir -p public/cv
cp "/Users/daksh/Desktop/Development/Projects/Daksh Singhvi CV.pdf" "public/cv/Daksh-Singhvi-CV.pdf"
```

- [ ] **Step 5: Verify types compile**

Run: `npx tsc --noEmit`
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add src/content public/cv
git commit -m "feat: add content data files and CV PDF"
```

---

### Task 3: Theme system (TDD) — tokens, provider, no-FOUC

**Files:**
- Create: `src/lib/theme.ts`, `src/lib/theme.test.ts`, `src/components/ThemeProvider.tsx`, `vitest.config.ts`
- Modify: `src/app/globals.css` (replace), `src/app/layout.tsx` (replace), `package.json` (scripts)

**Interfaces:**
- Consumes: nothing.
- Produces:
  - `theme.ts`: `type Theme = "dark" | "light"`, `THEME_STORAGE_KEY = "ds-theme"`, `DEFAULT_THEME: Theme`, `isTheme(v: unknown): v is Theme`, `resolveInitialTheme(stored: string | null): Theme`, `readStoredTheme(storage: Pick<Storage, "getItem">): Theme`, `persistTheme(storage: Pick<Storage, "setItem">, theme: Theme): void`, `toggleTheme(theme: Theme): Theme`
  - `ThemeProvider.tsx`: `ThemeProvider({ children })`, `useTheme(): { theme: Theme; toggle: () => void }`
  - CSS design tokens (used by every later task as Tailwind utilities): colors `accent`, `accent-soft`, `ink`, `ink-muted`, `surface`, `surface-strong`, `edge`; shadow `shadow-window`; `font-mono` (JetBrains Mono); wallpaper vars `--wall-sky-1/2`, `--wall-hill-1/2/3`, `--wall-glow`, `--stars-opacity`, `--moon-opacity`, `--sun-opacity`; helper classes `.wallpaper-fill`, `.wallpaper-stop`.

- [ ] **Step 1: Install Vitest and add scripts**

```bash
npm install -D vitest
```

In `package.json` `"scripts"`, add:

```json
"test": "vitest run",
"test:watch": "vitest"
```

Create `vitest.config.ts`:

```ts
import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: { environment: "node", include: ["src/**/*.test.ts"] },
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
});
```

- [ ] **Step 2: Write the failing tests — `src/lib/theme.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  persistTheme,
  readStoredTheme,
  resolveInitialTheme,
  toggleTheme,
} from "./theme";

function memoryStorage() {
  const store = new Map<string, string>();
  return {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => void store.set(k, v),
  };
}

describe("theme", () => {
  it("defaults to dark", () => {
    expect(DEFAULT_THEME).toBe("dark");
    expect(resolveInitialTheme(null)).toBe("dark");
  });

  it("keeps a valid stored value", () => {
    expect(resolveInitialTheme("light")).toBe("light");
    expect(resolveInitialTheme("dark")).toBe("dark");
  });

  it("falls back to dark on junk values", () => {
    expect(resolveInitialTheme("neon")).toBe("dark");
  });

  it("round-trips through storage", () => {
    const storage = memoryStorage();
    persistTheme(storage, "light");
    expect(storage.getItem(THEME_STORAGE_KEY)).toBe("light");
    expect(readStoredTheme(storage)).toBe("light");
  });

  it("survives a throwing storage", () => {
    const broken = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("denied");
      },
    };
    expect(readStoredTheme(broken)).toBe(DEFAULT_THEME);
    expect(() => persistTheme(broken, "light")).not.toThrow();
  });

  it("toggles between themes", () => {
    expect(toggleTheme("dark")).toBe("light");
    expect(toggleTheme("light")).toBe("dark");
  });
});
```

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./theme`.

- [ ] **Step 4: Implement `src/lib/theme.ts`**

```ts
export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "ds-theme";
export const DEFAULT_THEME: Theme = "dark";

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

export function resolveInitialTheme(stored: string | null): Theme {
  return isTheme(stored) ? stored : DEFAULT_THEME;
}

export function readStoredTheme(storage: Pick<Storage, "getItem">): Theme {
  try {
    return resolveInitialTheme(storage.getItem(THEME_STORAGE_KEY));
  } catch {
    return DEFAULT_THEME;
  }
}

export function persistTheme(storage: Pick<Storage, "setItem">, theme: Theme): void {
  try {
    storage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // storage unavailable (private mode) — theme still applies for this visit
  }
}

export function toggleTheme(theme: Theme): Theme {
  return theme === "dark" ? "light" : "dark";
}
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (6 tests).

- [ ] **Step 6: Write `src/components/ThemeProvider.tsx`**

```tsx
"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { DEFAULT_THEME, persistTheme, readStoredTheme, toggleTheme, type Theme } from "@/lib/theme";

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    setTheme(readStoredTheme(window.localStorage));
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    persistTheme(window.localStorage, theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => toggleTheme(t)) }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
```

- [ ] **Step 7: Replace `src/app/globals.css` with the token system**

```css
@import "tailwindcss";

:root,
:root[data-theme="dark"] {
  color-scheme: dark;
  --accent: #34c759;
  --accent-soft: rgba(52, 199, 89, 0.16);
  --ink: #eef5ef;
  --ink-muted: rgba(238, 245, 239, 0.66);
  --surface: rgba(16, 26, 21, 0.66);
  --surface-strong: rgba(10, 18, 14, 0.78);
  --edge: rgba(238, 245, 239, 0.14);
  --wall-sky-1: #0a1420;
  --wall-sky-2: #0f2620;
  --wall-hill-1: #16382a;
  --wall-hill-2: #0e2c1f;
  --wall-hill-3: #081f15;
  --wall-glow: #f4f1de;
  --stars-opacity: 1;
  --moon-opacity: 1;
  --sun-opacity: 0;
}

:root[data-theme="light"] {
  color-scheme: light;
  --accent: #1e9e46;
  --accent-soft: rgba(30, 158, 70, 0.14);
  --ink: #122a1c;
  --ink-muted: rgba(18, 42, 28, 0.68);
  --surface: rgba(255, 255, 255, 0.7);
  --surface-strong: rgba(255, 255, 255, 0.82);
  --edge: rgba(18, 42, 28, 0.14);
  --wall-sky-1: #7ec8ee;
  --wall-sky-2: #dff3ea;
  --wall-hill-1: #79c07d;
  --wall-hill-2: #55a862;
  --wall-hill-3: #3c8a4e;
  --wall-glow: #ffd76a;
  --stars-opacity: 0;
  --moon-opacity: 0;
  --sun-opacity: 1;
}

@theme inline {
  --color-accent: var(--accent);
  --color-accent-soft: var(--accent-soft);
  --color-ink: var(--ink);
  --color-ink-muted: var(--ink-muted);
  --color-surface: var(--surface);
  --color-surface-strong: var(--surface-strong);
  --color-edge: var(--edge);
  --font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace;
  --shadow-window: 0 24px 60px -18px rgba(0, 0, 0, 0.55);
}

html {
  scroll-behavior: smooth;
}

@media (prefers-reduced-motion: reduce) {
  html {
    scroll-behavior: auto;
  }
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto,
    "Helvetica Neue", sans-serif;
  background-color: var(--wall-sky-2);
  color: var(--ink);
  transition: background-color 800ms ease, color 800ms ease;
}

section[id] {
  scroll-margin-top: 3.5rem;
}

.wallpaper-fill {
  transition: fill 800ms ease, opacity 800ms ease;
}

.wallpaper-stop {
  transition: stop-color 800ms ease;
}
```

- [ ] **Step 8: Replace `src/app/layout.tsx`**

The inline script sets `data-theme` before first paint (no FOUC). `suppressHydrationWarning` is required because the client may render a different `data-theme` than the server HTML.

```tsx
import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: "Daksh Singhvi — Software Engineer",
  description:
    "Portfolio of Daksh Singhvi — Software Engineer in Liverpool, UK. 1+ years shipping scalable systems. Available for work.",
};

const themeInit = `try{var t=localStorage.getItem("ds-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${mono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 9: Verify build and tests**

Run: `npm test && npm run build`
Expected: tests PASS, build succeeds.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "feat: theme system with dark default, localStorage persistence and design tokens"
```

---

### Task 4: Wallpaper + Hero section

**Files:**
- Create: `src/components/desktop/Wallpaper.tsx`, `src/components/sections/Hero.tsx`, `src/components/Reveal.tsx`
- Modify: `src/app/page.tsx` (replace)

**Interfaces:**
- Consumes: `profile` from `@/content/profile`; CSS wallpaper vars from Task 3.
- Produces: `Wallpaper()` (fixed, behind everything), `Hero()` (section `id="home"`), `Reveal({ children, delay?, className? })` — shared scroll-reveal wrapper used by every later section.

- [ ] **Step 1: Install animation/icon deps**

```bash
npm install motion lucide-react
```

- [ ] **Step 2: Write `src/components/desktop/Wallpaper.tsx`**

Deterministic stars (seeded PRNG, computed at module scope) keep server and client HTML identical. All fills reference the theme CSS variables, so the dark↔light "Night Hills ↔ Day Hills" crossfade is pure CSS.

```tsx
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(7);
const STARS = Array.from({ length: 56 }, () => ({
  cx: +(rand() * 1440).toFixed(1),
  cy: +(rand() * 430).toFixed(1),
  r: +(0.6 + rand() * 1.1).toFixed(2),
  o: +(0.35 + rand() * 0.65).toFixed(2),
}));

export function Wallpaper() {
  return (
    <div aria-hidden="true" className="fixed inset-0 -z-10">
      <svg className="h-full w-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop className="wallpaper-stop" offset="0" stopColor="var(--wall-sky-1)" />
            <stop className="wallpaper-stop" offset="1" stopColor="var(--wall-sky-2)" />
          </linearGradient>
          <radialGradient id="glow">
            <stop offset="0" stopColor="var(--wall-glow)" stopOpacity="0.5" />
            <stop offset="1" stopColor="var(--wall-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1440" height="900" fill="url(#sky)" />
        <g className="wallpaper-fill" style={{ opacity: "var(--stars-opacity)" }}>
          {STARS.map((s, i) => (
            <circle key={i} cx={s.cx} cy={s.cy} r={s.r} opacity={s.o} fill="#ffffff" />
          ))}
        </g>
        <g className="wallpaper-fill" style={{ opacity: "var(--moon-opacity)" }}>
          <circle cx="1120" cy="170" r="120" fill="url(#glow)" />
          <circle cx="1120" cy="170" r="42" fill="var(--wall-glow)" />
          <circle className="wallpaper-fill" cx="1138" cy="156" r="36" fill="var(--wall-sky-1)" />
        </g>
        <g className="wallpaper-fill" style={{ opacity: "var(--sun-opacity)" }}>
          <circle cx="1120" cy="170" r="130" fill="url(#glow)" />
          <circle cx="1120" cy="170" r="52" fill="var(--wall-glow)" />
        </g>
        <path className="wallpaper-fill" fill="var(--wall-hill-1)" d="M0 620 C 240 560, 480 588, 720 540 C 960 492, 1200 556, 1440 512 L 1440 900 L 0 900 Z" />
        <path className="wallpaper-fill" fill="var(--wall-hill-2)" d="M0 706 C 260 648, 520 682, 780 640 C 1040 598, 1260 664, 1440 622 L 1440 900 L 0 900 Z" />
        <path className="wallpaper-fill" fill="var(--wall-hill-3)" d="M0 788 C 300 726, 600 764, 900 722 C 1150 688, 1330 744, 1440 712 L 1440 900 L 0 900 Z" />
      </svg>
    </div>
  );
}
```

- [ ] **Step 3: Write `src/components/Reveal.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: "easeOut", delay }}
    >
      {children}
    </motion.div>
  );
}
```

- [ ] **Step 4: Write `src/components/sections/Hero.tsx`**

```tsx
"use client";

import { motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { profile } from "@/content/profile";

export function Hero() {
  const reduce = useReducedMotion();
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  return (
    <section id="home" className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <motion.p
        {...fade(0.1)}
        className="flex items-center gap-2 rounded-full border border-edge bg-surface px-3.5 py-1.5 text-[13px] backdrop-blur"
      >
        <span className="relative flex size-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
          <span className="relative inline-flex size-2 rounded-full bg-accent" />
        </span>
        {profile.availability} · {profile.location}
      </motion.p>
      <motion.h1 {...fade(0.25)} className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">
        {profile.name}
      </motion.h1>
      <motion.p {...fade(0.4)} className="mt-4 text-xl text-ink-muted sm:text-2xl">
        {profile.role}
      </motion.p>
      <motion.p {...fade(0.5)} className="mt-2 max-w-xl text-balance text-sm text-ink-muted sm:text-base">
        {profile.summary}
      </motion.p>
      <motion.a {...fade(0.8)} href="#about" aria-label="Scroll to About" className="absolute bottom-24">
        <ChevronDown className="size-6 animate-bounce text-ink-muted motion-reduce:animate-none" />
      </motion.a>
    </section>
  );
}
```

- [ ] **Step 5: Replace `src/app/page.tsx`**

```tsx
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Wallpaper />
      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />
      </main>
    </>
  );
}
```

- [ ] **Step 6: Verify visually and build**

Run: `npm run dev` — open http://localhost:3000. Expected: Night Hills wallpaper (starry sky, crescent moon, three hill layers), centred hero with pulsing green availability pill, staggered entrance. Temporarily run `document.documentElement.dataset.theme = "light"` in the browser console — wallpaper crossfades to Day Hills. Then: `npm run build` succeeds.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: night/day hills wallpaper and hero section"
```

---

### Task 5: MacWindow shared component

**Files:**
- Create: `src/components/mac/MacWindow.tsx`

**Interfaces:**
- Consumes: design tokens.
- Produces: `MacWindow({ title, children, className?, contentClassName?, onClose? })` — shared window chrome used by About (terminal + skills), Experience, Projects and Contact. `onClose` provided ⇒ red traffic light becomes a working minimise button; otherwise all lights are decorative.

- [ ] **Step 1: Write `src/components/mac/MacWindow.tsx`**

```tsx
import type { ReactNode } from "react";

interface MacWindowProps {
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  onClose?: () => void;
}

export function MacWindow({ title, children, className, contentClassName, onClose }: MacWindowProps) {
  return (
    <div
      className={`overflow-hidden rounded-xl border border-edge bg-surface shadow-window backdrop-blur-xl ${className ?? ""}`}
    >
      <div className="flex h-9 items-center gap-2 border-b border-edge bg-surface-strong px-3">
        <span className="flex items-center gap-1.5">
          {onClose ? (
            <button
              onClick={onClose}
              aria-label={`Minimise ${title}`}
              className="group flex h-3 w-3 items-center justify-center rounded-full bg-[#ff5f57]"
            >
              <span className="text-[9px] leading-none text-black/60 opacity-0 group-hover:opacity-100">×</span>
            </button>
          ) : (
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]/90" aria-hidden="true" />
          )}
          <span className="h-3 w-3 rounded-full bg-[#febc2e]/90" aria-hidden="true" />
          <span className="h-3 w-3 rounded-full bg-[#28c840]/90" aria-hidden="true" />
        </span>
        <span className="min-w-0 flex-1 truncate pr-14 text-center text-xs font-medium text-ink-muted">
          {title}
        </span>
      </div>
      <div className={contentClassName ?? "p-4 sm:p-5"}>{children}</div>
    </div>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds (component is exercised visually from Task 9 onward; Playwright covers it in Task 14).

- [ ] **Step 3: Commit**

```bash
git add src/components/mac
git commit -m "feat: shared MacWindow chrome component"
```

---

### Task 6: Section registry, scrollspy + MenuBar

**Files:**
- Create: `src/lib/sections.ts`, `src/lib/use-active-section.ts`, `src/components/chrome/MenuBar.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `useTheme` (Task 3), `profile` (Task 2).
- Produces:
  - `sections.ts`: `SECTIONS: readonly { id, label }[]` in spec order (home, about, experience, projects, contact), `SECTION_IDS: string[]`, `type SectionId`
  - `use-active-section.ts`: `useActiveSection(sectionIds: readonly string[]): string`
  - `MenuBar()` — fixed top chrome: DS monogram → "About This Dev" popover, scrollspy section links (md+), theme toggle, live clock.

- [ ] **Step 1: Write `src/lib/sections.ts`**

```ts
export const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

export type SectionId = (typeof SECTIONS)[number]["id"];

export const SECTION_IDS: readonly SectionId[] = SECTIONS.map((s) => s.id);
```

- [ ] **Step 2: Write `src/lib/use-active-section.ts`**

Callers must pass a module-level constant array (`SECTION_IDS`) so the effect doesn't re-run each render.

```ts
"use client";

import { useEffect, useState } from "react";

export function useActiveSection(sectionIds: readonly string[]): string {
  const [active, setActive] = useState<string>(sectionIds[0]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [sectionIds]);

  return active;
}
```

- [ ] **Step 3: Write `src/components/chrome/MenuBar.tsx`**

Navigation uses plain `#hash` anchors; `scroll-behavior: smooth` in globals.css animates them and the reduced-motion media query switches to instant — no JS needed.

```tsx
"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { SECTIONS, SECTION_IDS } from "@/lib/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { useTheme } from "@/components/ThemeProvider";
import { profile } from "@/content/profile";

export function MenuBar() {
  const active = useActiveSection(SECTION_IDS);
  const { theme, toggle } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex h-9 items-center gap-5 border-b border-edge bg-surface-strong px-3 text-[13px] backdrop-blur-xl">
      <div className="relative">
        <button
          onClick={() => setMenuOpen((o) => !o)}
          aria-expanded={menuOpen}
          aria-haspopup="dialog"
          className="rounded px-1.5 py-0.5 font-semibold tracking-tight hover:bg-accent-soft"
        >
          DS
        </button>
        {menuOpen && (
          <>
            <button
              aria-label="Close menu"
              className="fixed inset-0 cursor-default"
              onClick={() => setMenuOpen(false)}
            />
            <div
              role="dialog"
              aria-label="About This Dev"
              className="absolute left-0 top-8 w-64 rounded-xl border border-edge bg-surface-strong p-4 shadow-window backdrop-blur-xl"
            >
              <p className="font-semibold">About This Dev</p>
              <p className="mt-1 text-xs text-ink-muted">
                DakshOS 26.08 &ldquo;Liverpool&rdquo; — one careful owner, ships weekly.
              </p>
              <div className="mt-3 flex flex-col gap-1.5 text-xs">
                <a className="hover:text-accent" href={profile.github} target="_blank" rel="noopener noreferrer">GitHub ↗</a>
                <a className="hover:text-accent" href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
                <a className="hover:text-accent" href={profile.cvPath} download>Download CV</a>
                <a className="hover:text-accent" href={`mailto:${profile.email}`}>Email me</a>
              </div>
            </div>
          </>
        )}
      </div>
      <nav aria-label="Sections" className="hidden gap-4 md:flex">
        {SECTIONS.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className={s.id === active ? "font-semibold text-ink" : "text-ink-muted transition-colors hover:text-ink"}
          >
            {s.label}
          </a>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">
        <button
          onClick={toggle}
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="rounded p-1 hover:bg-accent-soft"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <Clock />
      </div>
    </header>
  );
}

function Clock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return <span className="inline-block w-28" aria-hidden="true" />;

  const date = now.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
  const time = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });

  return (
    <time className="tabular-nums text-ink-muted">
      <span className="hidden sm:inline">{date} </span>
      {time}
    </time>
  );
}
```

- [ ] **Step 4: Mount in `src/app/page.tsx`**

Add `<MenuBar />` directly after `<Wallpaper />`:

```tsx
import { MenuBar } from "@/components/chrome/MenuBar";
// inside Home's JSX:
<Wallpaper />
<MenuBar />
```

- [ ] **Step 5: Verify visually and build**

Run: `npm run dev`. Expected: fixed translucent menu bar; DS menu opens/closes (click-out and Escape both close); theme toggle crossfades wallpaper and persists across reload; clock ticks. `npm run build` succeeds.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: menu bar with About This Dev popover, scrollspy, theme toggle and clock"
```

---

### Task 7: Dock (desktop magnification) + mobile tab bar

**Files:**
- Create: `src/components/chrome/Dock.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `SECTIONS`/`SECTION_IDS`/`SectionId`, `useActiveSection`, `profile`, lucide icons, Motion.
- Produces: `Dock()` — renders the desktop dock (md+, cursor-distance magnification, click bounce, running-app dot, separated external group) **and** the mobile 4-icon tab bar (`aria-label="Section tabs"`). Mounted once in `page.tsx`.

- [ ] **Step 1: Write `src/components/chrome/Dock.tsx`**

`scrollIntoView()` with default behavior respects the CSS `scroll-behavior` rules, so reduced-motion users get instant jumps for free.

```tsx
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
  Github,
  House,
  Linkedin,
  Mail,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { SECTION_IDS, type SectionId } from "@/lib/sections";
import { useActiveSection } from "@/lib/use-active-section";
import { profile } from "@/content/profile";

interface DockItem {
  id: string;
  label: string;
  icon: LucideIcon;
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
  { id: "github", label: "GitHub", icon: Github, tint: "from-zinc-500 to-zinc-700", action: { kind: "link", href: profile.github } },
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, tint: "from-blue-400 to-blue-600", action: { kind: "link", href: profile.linkedin } },
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
```

- [ ] **Step 2: Mount in `src/app/page.tsx`**

Add `<Dock />` as the last child inside the fragment (after `</main>`).

- [ ] **Step 3: Verify visually and build**

Run: `npm run dev`. Expected: dock magnifies near the cursor with springy falloff; clicking a nav icon bounces it once and smooth-scrolls; external icons open new tabs; a dot sits under the active section's icon. Narrow the window below 768px: dock disappears, 4-icon tab bar appears at the bottom. `npm run build` succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: magnifying dock with running-app dots and mobile tab bar"
```

---

### Task 8: Terminal command parser (TDD)

**Files:**
- Create: `src/lib/terminal.ts`, `src/lib/terminal.test.ts`, `src/content/terminal-commands.ts`

**Interfaces:**
- Consumes: `profile`, `skillGroups` (Task 2), `experience` (Task 2).
- Produces:
  - `terminal.ts`: `type LineKind = "output" | "error" | "accent"`, `interface TerminalLine { text: string; kind: LineKind }`, `type TerminalAction = "clear" | "open-mail"`, `interface CommandResult { lines: TerminalLine[]; action?: TerminalAction }`, `runCommand(rawInput: string): CommandResult`, `visibleCommands(): { name: string; description: string }[]`
  - `terminal-commands.ts`: `COMMANDS: TerminalCommand[]`, `UNKNOWN_HINT: string`, `interface TerminalCommand` (uses `import type` from `terminal.ts` — type-only circularity is fine).

- [ ] **Step 1: Write the failing tests — `src/lib/terminal.test.ts`**

```ts
import { describe, expect, it } from "vitest";
import { runCommand, visibleCommands } from "./terminal";
import { profile, skillGroups } from "@/content/profile";
import { experience } from "@/content/experience";

const text = (result: ReturnType<typeof runCommand>) => result.lines.map((l) => l.text).join("\n");

describe("runCommand", () => {
  it("returns nothing for empty input", () => {
    expect(runCommand("   ").lines).toHaveLength(0);
  });

  it("ignores case and surrounding whitespace", () => {
    expect(text(runCommand("  WhoAmI  "))).toContain(profile.name);
  });

  it("reports unknown commands with a help hint", () => {
    const result = runCommand("dance");
    expect(result.lines[0].kind).toBe("error");
    expect(result.lines[0].text).toContain("dance");
    expect(text(result)).toContain("help");
  });

  it("whoami prints name and role", () => {
    const output = text(runCommand("whoami"));
    expect(output).toContain(profile.name);
    expect(output).toContain(profile.role);
  });

  it("skills covers every skill group", () => {
    const output = text(runCommand("skills"));
    for (const group of skillGroups) expect(output).toContain(group.items[0]);
  });

  it("experience lists every work organisation", () => {
    const output = text(runCommand("experience"));
    for (const entry of experience.filter((e) => e.kind === "work")) {
      expect(output).toContain(entry.organisation);
    }
  });

  it("education mentions the degree result", () => {
    expect(text(runCommand("education"))).toContain("First Class");
  });

  it("clear returns the clear action and no output", () => {
    const result = runCommand("clear");
    expect(result.action).toBe("clear");
    expect(result.lines).toHaveLength(0);
  });

  it("sudo hire-me is denied, then opens mail", () => {
    for (const variant of ["sudo hire-me", "SUDO   HIRE-ME"]) {
      const result = runCommand(variant);
      expect(result.action).toBe("open-mail");
      expect(text(result)).toContain("not in the sudoers file");
    }
  });

  it("keeps easter eggs runnable but out of the visible list", () => {
    const names = visibleCommands().map((c) => c.name);
    expect(names).not.toContain("neofetch");
    expect(runCommand("neofetch").lines.length).toBeGreaterThan(0);
    expect(runCommand("rm -rf /").lines[0].kind).toBe("error");
  });

  it("help lists exactly the visible commands", () => {
    const output = text(runCommand("help"));
    for (const { name } of visibleCommands()) expect(output).toContain(name);
    expect(output).not.toContain("neofetch");
  });
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npm test`
Expected: FAIL — cannot resolve `./terminal`.

- [ ] **Step 3: Write `src/lib/terminal.ts`**

```ts
import { COMMANDS, UNKNOWN_HINT } from "@/content/terminal-commands";

export type LineKind = "output" | "error" | "accent";

export interface TerminalLine {
  text: string;
  kind: LineKind;
}

export type TerminalAction = "clear" | "open-mail";

export interface CommandResult {
  lines: TerminalLine[];
  action?: TerminalAction;
}

export function runCommand(rawInput: string): CommandResult {
  const input = rawInput.trim();
  if (input === "") return { lines: [] };

  const normalized = input.toLowerCase().replace(/\s+/g, " ");
  const command = COMMANDS.find((c) => c.match.includes(normalized));
  if (!command) {
    return {
      lines: [
        { text: `zsh: command not found: ${input}`, kind: "error" },
        { text: UNKNOWN_HINT, kind: "output" },
      ],
    };
  }
  return command.run();
}

export function visibleCommands(): { name: string; description: string }[] {
  return COMMANDS.filter((c) => !c.hidden).map((c) => ({ name: c.name, description: c.description }));
}
```

- [ ] **Step 4: Write `src/content/terminal-commands.ts`**

```ts
import { experience } from "./experience";
import { profile, skillGroups } from "./profile";
import type { CommandResult, TerminalLine } from "@/lib/terminal";

export interface TerminalCommand {
  name: string;
  match: string[]; // normalized (lowercase, single-spaced) inputs that trigger it
  description: string;
  hidden?: boolean;
  run: () => CommandResult;
}

const out = (text: string): TerminalLine => ({ text, kind: "output" });
const accent = (text: string): TerminalLine => ({ text, kind: "accent" });
const error = (text: string): TerminalLine => ({ text, kind: "error" });

export const UNKNOWN_HINT = "Type 'help' to see what I respond to.";

export const COMMANDS: TerminalCommand[] = [
  {
    name: "whoami",
    match: ["whoami"],
    description: "who is this?",
    run: () => ({
      lines: [
        accent(`${profile.name} — ${profile.role}`),
        out(`${profile.location} · ${profile.availability} · UK Graduate Visa eligible`),
        out("1+ years shipping scalable systems at Sentric Music."),
        out("Type 'skills', 'experience' or 'education' for the details."),
      ],
    }),
  },
  {
    name: "skills",
    match: ["skills"],
    description: "tech I work with",
    run: () => ({
      lines: skillGroups.map((group) => out(`${group.label}: ${group.items.join(", ")}`)),
    }),
  },
  {
    name: "experience",
    match: ["experience"],
    description: "where I've shipped",
    run: () => ({
      lines: experience
        .filter((e) => e.kind === "work")
        .flatMap((e) => [accent(`${e.organisation} — ${e.role} (${e.period})`), out(e.highlights[0])]),
    }),
  },
  {
    name: "education",
    match: ["education"],
    description: "degree & grades",
    run: () => ({
      lines: experience
        .filter((e) => e.kind === "education")
        .flatMap((e) => [accent(`${e.organisation} — ${e.role} (${e.period})`), ...e.highlights.map(out)]),
    }),
  },
  {
    name: "cricket",
    match: ["cricket"],
    description: "life off the keyboard",
    run: () => ({
      lines: [
        out("🏏 Off the field: cricket coach & 1st XI athlete at Sefton Park CC."),
        out("I coach ~6 junior cricketers weekly and play 1st Division cricket on weekends."),
      ],
    }),
  },
  {
    name: "sudo hire-me",
    match: ["sudo hire-me", "sudo hire me"],
    description: "escalate privileges",
    run: () => ({
      lines: [
        out("[sudo] password for recruiter: ********"),
        error("recruiter is not in the sudoers file. This incident will be reported."),
        accent(`…reported straight to ${profile.email} — opening Mail.`),
      ],
      action: "open-mail",
    }),
  },
  {
    name: "help",
    match: ["help"],
    description: "this list",
    run: () => ({
      lines: COMMANDS.filter((c) => !c.hidden).map((c) => out(`${c.name.padEnd(14)}${c.description}`)),
    }),
  },
  {
    name: "clear",
    match: ["clear"],
    description: "clear the screen",
    run: () => ({ lines: [], action: "clear" }),
  },
  {
    name: "neofetch",
    match: ["neofetch"],
    hidden: true,
    description: "",
    run: () => ({
      lines: [
        accent("daksh@portfolio"),
        out("---------------"),
        out('OS:      DakshOS 26.08 "Liverpool"'),
        out("Host:    University of Liverpool — BSc CS, First Class Hons"),
        out("Kernel:  caffeine-6.2.0"),
        out("Uptime:  1+ years in production (Sentric Music)"),
        out("Shell:   zsh, obviously"),
        out("Theme:   Night Hills [dark]"),
        out("CPU:     Cricket-trained reflexes @ 5.0GHz"),
        out("Memory:  Excellent — ask about the 10M-record batch jobs"),
      ],
    }),
  },
  {
    name: "rm -rf /",
    match: ["rm -rf /", "rm -rf /*", "rm -rf"],
    hidden: true,
    description: "",
    run: () => ({
      lines: [
        error("rm: it's a portfolio, not a demolition site."),
        out("Try 'sudo hire-me' instead."),
      ],
    }),
  },
];
```

- [ ] **Step 5: Run tests to verify they pass**

Run: `npm test`
Expected: PASS (theme + terminal suites).

- [ ] **Step 6: Commit**

```bash
git add src/lib/terminal.ts src/lib/terminal.test.ts src/content/terminal-commands.ts
git commit -m "feat: terminal command parser with easter eggs (TDD)"
```

---

### Task 9: Terminal component + About section

**Files:**
- Create: `src/components/terminal/Terminal.tsx`, `src/components/SectionHeader.tsx`, `src/components/sections/About.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `runCommand`/`visibleCommands`/`TerminalLine` (Task 8), `MacWindow` (Task 5), `Reveal` (Task 4), `profile`/`skillGroups` (Task 2).
- Produces: `Terminal()`, `SectionHeader({ eyebrow, title, blurb? })` (reused by Experience/Projects/Contact), `About()` (section `id="about"`).

- [ ] **Step 1: Write `src/components/SectionHeader.tsx`**

```tsx
export function SectionHeader({
  eyebrow,
  title,
  blurb,
}: {
  eyebrow: string;
  title: string;
  blurb?: string;
}) {
  return (
    <div className="mb-8">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-accent">{eyebrow}</p>
      <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {blurb && <p className="mt-2 max-w-2xl text-sm text-ink-muted sm:text-base">{blurb}</p>}
    </div>
  );
}
```

- [ ] **Step 2: Write `src/components/terminal/Terminal.tsx`**

`overscroll-contain` on the scroll area stops the terminal from trapping page scroll (spec §4). History: ↑/↓ recall previous inputs; chips run commands for mouse users.

```tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { MacWindow } from "@/components/mac/MacWindow";
import { profile } from "@/content/profile";
import { runCommand, visibleCommands, type TerminalLine } from "@/lib/terminal";

interface HistoryEntry {
  input: string;
  lines: TerminalLine[];
}

const PROMPT = "daksh@portfolio ~ %";

const LINE_STYLES: Record<TerminalLine["kind"], string> = {
  output: "text-ink-muted",
  error: "text-red-400",
  accent: "text-accent",
};

export function Terminal() {
  const [entries, setEntries] = useState<HistoryEntry[]>([
    { input: "", lines: [{ text: "Welcome. Type 'help' or tap a command below.", kind: "output" }] },
  ]);
  const [input, setInput] = useState("");
  const [past, setPast] = useState<string[]>([]);
  const [cursor, setCursor] = useState(-1); // -1 = composing a new line
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [entries]);

  function submit(raw: string) {
    const result = runCommand(raw);
    if (result.action === "clear") {
      setEntries([]);
    } else {
      setEntries((prev) => [...prev, { input: raw, lines: result.lines }]);
    }
    if (result.action === "open-mail") {
      window.location.href = `mailto:${profile.email}?subject=${encodeURIComponent("Hiring Daksh")}`;
    }
    if (raw.trim() !== "") setPast((prev) => [...prev, raw]);
    setCursor(-1);
    setInput("");
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submit(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (past.length === 0) return;
      const next = cursor === -1 ? past.length - 1 : Math.max(0, cursor - 1);
      setCursor(next);
      setInput(past[next]);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (cursor === -1) return;
      const next = cursor + 1;
      if (next >= past.length) {
        setCursor(-1);
        setInput("");
      } else {
        setCursor(next);
        setInput(past[next]);
      }
    }
  }

  return (
    <MacWindow title="daksh@portfolio — zsh" contentClassName="p-0">
      <div
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
        className="h-72 cursor-text overflow-y-auto overscroll-contain p-4 font-mono text-[13px] leading-6"
      >
        {entries.map((entry, i) => (
          <div key={i}>
            {entry.input !== "" && (
              <p>
                <span className="text-accent">{PROMPT}</span> {entry.input}
              </p>
            )}
            {entry.lines.map((line, j) => (
              <p key={j} className={LINE_STYLES[line.kind]}>
                {line.text}
              </p>
            ))}
          </div>
        ))}
        <p className="flex gap-2">
          <span className="shrink-0 text-accent">{PROMPT}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            aria-label="Terminal input"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-transparent outline-none"
          />
        </p>
      </div>
      <div className="flex flex-wrap gap-1.5 border-t border-edge p-3">
        {visibleCommands().map(({ name }) => (
          <button
            key={name}
            onClick={() => submit(name)}
            className="rounded-full border border-edge bg-surface px-2.5 py-1 font-mono text-xs text-ink-muted transition-colors hover:border-accent hover:text-ink"
          >
            {name}
          </button>
        ))}
      </div>
    </MacWindow>
  );
}
```

- [ ] **Step 3: Write `src/components/sections/About.tsx`**

```tsx
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
```

- [ ] **Step 4: Mount in `src/app/page.tsx`**

Add `<About />` directly after `<Hero />` inside `<main>`.

- [ ] **Step 5: Verify visually, tests and build**

Run: `npm run dev`. Expected: About section with terminal (typing `help`, ↑ history and chips all work; `sudo hire-me` opens the mail client; page scroll doesn't get stuck inside the terminal) beside the skills pills window. Then `npm test && npm run build` — all pass.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: interactive terminal and About section with skills grid"
```

---

### Task 10: Experience section (Finder-style)

**Files:**
- Create: `src/components/sections/Experience.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `MacWindow`, `Reveal`, `SectionHeader`, `experience`/`ExperienceEntry`, lucide `Briefcase`/`GraduationCap`.
- Produces: `Experience()` (section `id="experience"`).

- [ ] **Step 1: Write `src/components/sections/Experience.tsx`**

```tsx
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
```

- [ ] **Step 2: Mount in `src/app/page.tsx`**

Add `<Experience />` after `<About />`.

- [ ] **Step 3: Verify visually and build**

Run: `npm run dev`. Expected: Finder window with sidebar (desktop) or stacked groups with labels (mobile), Sentric/Al Futtaim under Work, Liverpool under Education. `npm run build` succeeds.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: Finder-style experience section"
```

---

### Task 11: Projects section (draggable windows + minimise shelf)

**Files:**
- Create: `src/components/sections/Projects.tsx`, `src/lib/use-media-query.ts`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `MacWindow` (with `onClose`), `Reveal`, `SectionHeader`, `featuredProjects`/`miniProjects` (Task 2), `profile`, Motion, lucide `ArrowUpRight`.
- Produces: `Projects()` (section `id="projects"`), `useMediaQuery(query: string): boolean`.

- [ ] **Step 1: Write `src/lib/use-media-query.ts`**

```ts
"use client";

import { useEffect, useState } from "react";

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
```

- [ ] **Step 2: Write `src/components/sections/Projects.tsx`**

Windows drag only on desktop with motion allowed (`dragSnapToOrigin` gives the spec's spring-back); closing minimises to a shelf chip; Motion treats a click-without-movement as a click, so links inside stay usable.

```tsx
"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { profile } from "@/content/profile";
import { featuredProjects, miniProjects, type Project } from "@/content/projects";
import { useMediaQuery } from "@/lib/use-media-query";

export function Projects() {
  const [minimized, setMinimized] = useState<string[]>([]);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const reduce = useReducedMotion();
  const draggable = isDesktop && !reduce;

  return (
    <section id="projects" className="py-24">
      <Reveal>
        <SectionHeader
          eyebrow="03 · Projects"
          title="Things I've built"
          blurb="Drag the windows around — they're real windows. Close one and it minimises to the shelf."
        />
      </Reveal>
      <AnimatePresence>
        {minimized.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex flex-wrap gap-2"
          >
            {minimized.map((id) => {
              const project = featuredProjects.find((p) => p.id === id);
              if (!project) return null;
              return (
                <button
                  key={id}
                  onClick={() => setMinimized((prev) => prev.filter((m) => m !== id))}
                  className="rounded-full border border-edge bg-surface px-3 py-1 text-xs backdrop-blur transition-colors hover:border-accent"
                >
                  ↑ {project.name}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={constraintsRef} className="grid gap-6 md:grid-cols-2">
        <AnimatePresence>
          {featuredProjects
            .filter((p) => !minimized.includes(p.id))
            .map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.85, y: 40 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                drag={draggable}
                dragConstraints={constraintsRef}
                dragElastic={0.18}
                dragSnapToOrigin
                whileDrag={{ scale: 1.03 }}
                className="relative"
              >
                <ProjectWindow
                  project={project}
                  onMinimise={() => setMinimized((prev) => [...prev, project.id])}
                />
              </motion.div>
            ))}
        </AnimatePresence>
      </div>
      <Reveal className="mt-6">
        <div className="grid gap-3 sm:grid-cols-3">
          {miniProjects.map((mini) => (
            <a
              key={mini.name}
              href={mini.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-xl border border-edge bg-surface p-4 backdrop-blur transition-colors hover:border-accent"
            >
              <p className="flex items-center gap-1 font-mono text-sm font-medium">
                {mini.name}
                <ArrowUpRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
              </p>
              <p className="mt-1 text-xs text-ink-muted">{mini.tagline}</p>
            </a>
          ))}
          <a
            href={`${profile.github}?tab=repositories`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-xl border border-dashed border-edge p-4 text-sm text-ink-muted transition-colors hover:border-accent hover:text-accent"
          >
            more on GitHub →
          </a>
        </div>
      </Reveal>
    </section>
  );
}

function ProjectWindow({ project, onMinimise }: { project: Project; onMinimise: () => void }) {
  return (
    <MacWindow title={project.name} onClose={onMinimise} className="h-full">
      <div className="flex flex-col gap-3">
        {project.impact && <p className="text-sm font-medium text-accent">{project.impact}</p>}
        <p className="text-sm text-ink-muted">{project.description}</p>
        <ul className="flex flex-wrap gap-1.5">
          {project.tech.map((t) => (
            <li key={t} className="rounded-full border border-edge bg-surface px-2 py-0.5 font-mono text-[11px]">
              {t}
            </li>
          ))}
        </ul>
        <div className="mt-1 flex flex-wrap gap-2">
          {project.links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              {...(link.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className="inline-flex items-center gap-1 rounded-lg bg-accent-soft px-3 py-1.5 text-xs font-medium text-accent transition-colors hover:bg-accent hover:text-white"
            >
              {link.label} <ArrowUpRight className="size-3.5" />
            </a>
          ))}
        </div>
      </div>
    </MacWindow>
  );
}
```

- [ ] **Step 3: Mount in `src/app/page.tsx`**

Add `<Projects />` after `<Experience />`.

- [ ] **Step 4: Verify visually and build**

Run: `npm run dev`. Expected: 4 project windows, impact line first in accent green; windows drag with elastic bounds and spring back on release; red light minimises to a chip that restores; links open. Below 768px: static cards, no drag. `npm run build` succeeds.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: draggable project windows with minimise shelf and mini-project row"
```

---

### Task 12: Contact section + footer

**Files:**
- Create: `src/components/sections/Contact.tsx`
- Modify: `src/app/page.tsx`

**Interfaces:**
- Consumes: `MacWindow`, `Reveal`, `SectionHeader`, `profile`, lucide `ArrowUpRight`/`FileText`/`Github`/`Linkedin`.
- Produces: `Contact()` (section `id="contact"`, includes the page footer). Completes the page: final order Hero → About → Experience → Projects → Contact.

- [ ] **Step 1: Write `src/components/sections/Contact.tsx`**

```tsx
"use client";

import { ArrowUpRight, FileText, Github, Linkedin } from "lucide-react";
import { MacWindow } from "@/components/mac/MacWindow";
import { Reveal } from "@/components/Reveal";
import { SectionHeader } from "@/components/SectionHeader";
import { profile } from "@/content/profile";

const TILES = [
  { label: "GitHub", href: profile.github, icon: Github, external: true },
  { label: "LinkedIn", href: profile.linkedin, icon: Linkedin, external: true },
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
```

- [ ] **Step 2: Finalise `src/app/page.tsx`**

The complete file:

```tsx
import { Dock } from "@/components/chrome/Dock";
import { MenuBar } from "@/components/chrome/MenuBar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <Wallpaper />
      <MenuBar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Dock />
    </>
  );
}
```

- [ ] **Step 3: Verify visually, tests and build**

Run: `npm run dev` — full page walk-through: all five sections in order, dock dot follows scroll, mail composer's Send opens the mail client, CV downloads, footer clears the dock. `npm test && npm run build` pass.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: mail-composer contact section and footer — page complete"
```

---

### Task 13: SEO metadata, OG image, favicon

**Files:**
- Create: `src/app/opengraph-image.tsx`, `src/app/icon.svg`
- Modify: `src/app/layout.tsx` (metadata only)

**Interfaces:**
- Consumes: `profile` (for the metadata description only — OG image uses literals because `ImageResponse` runs at build).
- Produces: OG/Twitter card image at `/opengraph-image`, favicon, complete metadata for link unfurls.

- [ ] **Step 1: Update the `metadata` export in `src/app/layout.tsx`**

`metadataBase` is provisional until the first deploy (Task 16 revisits it):

```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://dxksh-portfolio.vercel.app"), // PROVISIONAL — set to real URL after first deploy
  title: "Daksh Singhvi — Software Engineer",
  description:
    "Portfolio of Daksh Singhvi — Software Engineer in Liverpool, UK. 1+ years shipping scalable systems. Available for work.",
  openGraph: {
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Available for work in Liverpool, UK.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Available for work in Liverpool, UK.",
  },
};
```

- [ ] **Step 2: Write `src/app/opengraph-image.tsx`**

```tsx
import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 96,
          background: "linear-gradient(180deg, #0a1420 0%, #0f2620 100%)",
          color: "#eef5ef",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 28, color: "#34c759" }}>
          <div style={{ width: 16, height: 16, borderRadius: 999, background: "#34c759" }} />
          Available for work · Liverpool, UK
        </div>
        <div style={{ fontSize: 92, fontWeight: 700, marginTop: 28 }}>Daksh Singhvi</div>
        <div style={{ fontSize: 38, marginTop: 12, color: "rgba(238,245,239,0.72)" }}>
          Software Engineer · dsinghvi07@gmail.com
        </div>
      </div>
    ),
    size
  );
}
```

- [ ] **Step 3: Write `src/app/icon.svg`**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="#0f2620"/>
  <text x="32" y="42" font-family="Menlo, monospace" font-size="26" font-weight="700" fill="#34c759" text-anchor="middle">DS</text>
</svg>
```

- [ ] **Step 4: Verify build output**

Run: `npm run build`
Expected: succeeds; `ls out/ | grep -i opengraph` shows the generated OG image; `out/index.html` contains `og:image` and `twitter:card` meta tags (check with `grep -o 'og:image' out/index.html`).

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: SEO metadata, OG image and favicon"
```

---

### Task 14: Playwright smoke tests

**Files:**
- Create: `playwright.config.ts`, `tests/e2e/smoke.spec.ts`
- Modify: `package.json` (script), `.gitignore`

**Interfaces:**
- Consumes: the built static site in `out/` (tests run against the real export, served statically).
- Produces: `npm run test:e2e` covering nav, theme persistence, terminal, mobile viewport and CV link (spec §5 testing requirements).

- [ ] **Step 1: Install Playwright**

```bash
npm install -D @playwright/test serve
npx playwright install chromium
```

Add to `package.json` scripts: `"test:e2e": "playwright test"`.
Append to `.gitignore`:

```
playwright-report/
test-results/
```

- [ ] **Step 2: Write `playwright.config.ts`**

```ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  webServer: {
    command: "npm run build && npx serve out -l 4173",
    url: "http://localhost:4173",
    reuseExistingServer: !process.env.CI,
    timeout: 180_000,
  },
  use: { baseURL: "http://localhost:4173" },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
```

- [ ] **Step 3: Write `tests/e2e/smoke.spec.ts`**

```ts
import { expect, test } from "@playwright/test";

test("shows identity immediately", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Daksh Singhvi" })).toBeVisible();
  await expect(page.getByText("Available for work · Liverpool, UK")).toBeVisible();
});

test("dock navigates to sections", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("navigation", { name: "Dock" }).getByRole("button", { name: "Projects" }).click();
  await expect(page.locator("#projects")).toBeInViewport();
});

test("theme toggles and persists across reloads", async ({ page }) => {
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await expect(html).toHaveAttribute("data-theme", "light");
  await page.reload();
  await expect(html).toHaveAttribute("data-theme", "light");
});

test("terminal chips run commands", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "whoami", exact: true }).click();
  await expect(page.getByText("UK Graduate Visa eligible")).toBeVisible();
});

test("mobile shows the tab bar instead of the dock", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(page.getByRole("navigation", { name: "Section tabs" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Dock" })).toBeHidden();
});

test("CV download link points at the PDF", async ({ page }) => {
  await page.goto("/");
  const link = page.getByRole("link", { name: "Download CV" }).first();
  await expect(link).toHaveAttribute("href", "/cv/Daksh-Singhvi-CV.pdf");
});
```

- [ ] **Step 4: Run the suite**

Run: `npm run test:e2e`
Expected: 6 tests PASS. If a locator fails, fix the component (or locator if the component is right) and re-run until green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "test: Playwright smoke suite over the static export"
```

---

### Task 15: Reduced-motion audit + Lighthouse ≥90

**Files:**
- Modify: whichever files the audits flag (typically `globals.css` contrast tokens, aria labels, `layout.tsx`).

**Interfaces:**
- Consumes: the complete site.
- Produces: verified `prefers-reduced-motion` behaviour and Lighthouse ≥90 in all four categories (spec success criteria).

- [ ] **Step 1: Reduced-motion audit**

Run `npm run dev`, then in Chrome DevTools → Rendering → "Emulate CSS media feature prefers-reduced-motion: reduce". Verify each item; fix any failures in the named component:

- Hero: no entrance slide (fade only), availability ping hidden, chevron not bouncing.
- Menu bar/tab bar anchors: instant jump, no smooth scroll.
- Dock: no magnification, no click bounce (scroll still works).
- Reveal wrappers: fade without vertical offset.
- Projects: windows not draggable.
- Theme toggle: colors still crossfade (color transitions are permitted; no transform motion anywhere).

- [ ] **Step 2: Run Lighthouse (desktop and mobile)**

```bash
npm run build
npx serve out -l 4173 &
SERVE_PID=$!
npx lighthouse http://localhost:4173 --preset=desktop --output=json --output-path=lh-desktop.json --chrome-flags="--headless=new" --quiet
npx lighthouse http://localhost:4173 --output=json --output-path=lh-mobile.json --chrome-flags="--headless=new" --quiet
node -e "for (const f of ['lh-desktop.json','lh-mobile.json']) { const r = require('./' + f); console.log(f, Object.fromEntries(Object.entries(r.categories).map(([k, v]) => [k, Math.round(v.score * 100)]))); }"
kill $SERVE_PID
rm lh-desktop.json lh-mobile.json
```

Expected: performance, accessibility, best-practices and SEO all ≥90 in both runs.

- [ ] **Step 3: Fix anything below 90**

Common fixes for this build, in likely order: raise `--ink-muted` opacity for contrast (dark: `0.72`, light: `0.74`); ensure every icon-only button kept its `aria-label`; confirm `<html lang="en">`; chip/tap targets ≥24×24px (increase chip `py` if flagged). Re-run Step 2 after each fix until all ≥90.

- [ ] **Step 4: Full verification pass**

Run: `npm test && npm run test:e2e && npm run build`
Expected: everything green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "polish: reduced-motion audit fixes and Lighthouse >=90 all categories"
```

---

### Task 16: README, publish to GitHub, deploy to Vercel

**Files:**
- Create: `README.md`
- Modify: `src/app/layout.tsx` (real `metadataBase` after first deploy)

**Interfaces:**
- Consumes: the finished, verified site.
- Produces: public repo `Dxksh/portfolio`, live Vercel deployment, README (the repo is itself a portfolio artefact — spec §5).

- [ ] **Step 1: Write `README.md`**

````md
# Daksh Singhvi — Portfolio

A macOS-desktop-themed portfolio, built as a fully static Next.js one-pager.
Dark "Night Hills" by default, light "Day Hills" behind the menu-bar toggle.

**Live:** https://dxksh-portfolio.vercel.app <!-- update after first deploy -->

## The fun parts

- 🖥️ Menu bar with scrollspy, live clock and an "About This Dev" popover
- 🚀 Dock with cursor-distance magnification, click bounce and running-app dots
- 🪟 Draggable project windows — close one and it minimises to a shelf
- ⌨️ A real terminal: `whoami`, `skills`, `sudo hire-me`… and a couple of hidden ones
- ♿ Full `prefers-reduced-motion` support; Lighthouse ≥90 across the board

## Stack

Next.js (App Router, static export) · Tailwind CSS v4 · Motion · TypeScript

## Develop

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # unit tests (Vitest)
npm run test:e2e   # smoke tests (Playwright)
npm run build      # static export to out/
```

All copy lives in `src/content/*.ts` — edit those files, not the components.
````

- [ ] **Step 2: Commit and publish the repo**

```bash
git add README.md
git commit -m "docs: README"
gh repo create Dxksh/portfolio --public --source . --push
```

If `gh` isn't authenticated, run `gh auth login` first (needs the user if no stored credentials — pause and report rather than guessing).

- [ ] **Step 3: Deploy to Vercel**

```bash
npx vercel --prod
```

If the CLI isn't authenticated, this is a human checkpoint: ask the user to run `npx vercel login`, or to import `Dxksh/portfolio` in the Vercel dashboard (which also sets up auto-deploy from `main`). If CLI deploy succeeded, connect auto-deploy: `npx vercel git connect`.

- [ ] **Step 4: Set the real `metadataBase` and redeploy**

Replace the provisional `metadataBase` URL in `src/app/layout.tsx` and the `Live:` link in `README.md` with the actual production URL from Step 3, then:

```bash
npm run build
git add -A
git commit -m "chore: point metadataBase at production URL"
git push
```

- [ ] **Step 5: Post-deploy verification**

Open the production URL: page loads, theme toggle persists, CV downloads, OG preview renders (check with an unfurl tester or `curl -s <url> | grep og:image`). Report the live URL.

---

## Post-plan notes (for the executor)

- **User copy pass (spec §7):** after deploy, the user reviews everything in `src/content/*.ts` — especially items marked `PROVISIONAL` (Music Deepfake Detector and Autonomous Robot Mapper descriptions/links, LinkedIn URL) and the Numble naming (its CV links point at `duelle-game.vercel.app` / `Dxksh/duelle`).
- **Wallpaper is provisional-approved** (spec §7) — if the user dislikes Night Hills in the real build, only `Wallpaper.tsx` + the `--wall-*` tokens change.
