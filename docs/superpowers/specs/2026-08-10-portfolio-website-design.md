# Portfolio Website — Design Spec

**Date:** 2026-08-10
**Owner:** Daksh Singhvi
**Status:** Approved (user-reviewed 2026-08-10 — section reorder + sarthakjha.dev content inspiration applied)

## 1. Purpose & Audience

A personal portfolio for a CS graduate seeking Software Engineering roles. Inspired by the "Creatie" Framer template's macOS-desktop concept, rebuilt dark and engineer-flavoured.

Two audiences, in priority order:

1. **Recruiters** — skim in 30–60 s, often mobile. Must get identity, projects, CV and contact with zero learning curve.
2. **Engineers / hiring managers** — explore for minutes. The interactive macOS layer is the skills showcase for them.

**Success criteria:** loads fast, reads instantly on mobile, name is Googleable (SEO + OG preview), and at least one "oh that's neat" moment per visit (dock physics, terminal, draggable windows).

## 2. Decisions Made (with user)

| Decision | Choice |
|---|---|
| Concept | **Scroll-first hybrid** — normal scrolling one-pager; macOS layer as progressive enhancement |
| Theme | **Dark default + light toggle** (macOS-style appearance switch in menu bar, persisted in `localStorage`) |
| Tone | **Polished system aesthetic + discoverable easter eggs** (no stickers/googly eyes) |
| Wallpaper | **"Night Hills"** — the Creatie hills at night: starry sky, moon, deep green-navy, **mint-green accent** (`#34c759` family). Light mode = sunny "Day Hills" variant. User may revisit later — wallpaper is an isolated CSS/SVG layer, cheap to swap |
| Stack | **Next.js (App Router, fully static) + Tailwind CSS + Motion (Framer Motion), deployed on Vercel** |
| Section order | **About → Experience → Projects** (after hero), per user review |
| Content inspiration | [sarthakjha.dev](https://www.sarthakjha.dev/) — proof-of-impact metrics on project cards, skills as tag pills. **Presentation ideas only; the macOS design language stays exactly as specced** |

## 3. Page Structure (one page, five sections)

Fixed chrome: **menu bar** (top) and **dock** (bottom) always visible on desktop.

1. **Hero — "the desktop":** Night Hills wallpaper (custom SVG/CSS, no Apple-copyrighted assets). Green-dot pill "Available for work · Liverpool, UK", name, "Software Engineer" + one-line summary (graduate, 1+ yr shipping at scale). Dock is the primary nav.
2. **About — terminal + skills panel:** interactive Terminal window beside a skim-able skills grid (languages / frameworks / cloud & tools from CV, rendered as compact tag pills). Recruiters never need to type to see skills.
3. **Experience — Finder-style list:** Sentric Music (Associate SWE, Sep 2024–Sep 2025; 10M+ records/run, 150+ internal users), Al Futtaim Blue Rewards (intern; GPT-4o receipt scanning, 2M-user dashboard), education (Liverpool BSc CS, First Class Hons, 99% SE exam, VC Scholarship).
4. **Projects — "the windows":** 4 featured as mac windows: **Numble** (live demo + repo), **Padelo** (Play Store, private repo), **Music Deepfake Detector**, **Autonomous Robot Mapper**. Compact row below: react-storefront, SimonGame, "more on GitHub →". Each featured window leads with a one-line impact metric where one exists (users, downloads, accuracy) before the tech detail — proof of impact first.
5. **Contact — mail composer:** email CTA, GitHub, LinkedIn, **Download CV** (PDF in `public/cv/`). Footer: © · "Built with Next.js · Designed like a Mac".

Dock icon order and scrollspy follow this section order.

## 4. Interaction Layer

- **Menu bar:** "DS" monogram menu → "About This Dev" popover (version joke, quick links). Section links with scrollspy highlight. Right: theme toggle (crossfade Night ↔ Day Hills), live clock.
- **Dock (desktop):** cursor-distance magnification via Motion springs; click = one macOS bounce + smooth-scroll; running-app dot under active section's icon. External icons (GitHub, LinkedIn, CV) in a separated group, open new tabs.
- **Project windows:** draggable within the projects section bounds (spring-back), focus shadow. Traffic lights decorative except close → minimizes to a "reopen" chip. Touch devices: static cards, no drag.
- **Terminal:** real input, prompt, ↑/↓ history, `help`. Commands: `whoami`, `skills`, `experience`, `education`, `cricket`, `clear`, `sudo hire-me` (permission-denied joke → opens mail), plus 1–2 hidden. Clickable command chips for mouse users. Must not trap page scroll.
- **Mobile (<768 px):** slim menu bar (monogram + clock + toggle); dock becomes 4-icon fixed tab bar (no magnification); windows/terminal as static cards (terminal usable via chips).
- **Motion discipline:** `prefers-reduced-motion` honoured everywhere (fade fallbacks); transform/opacity animations only.

## 5. Architecture

- **Content as data:** all copy in `src/content/*.ts` (`profile.ts`, `projects.ts`, `experience.ts`, `terminal-commands.ts`). "Sort info later" = edit these files only. CV PDF at `public/cv/`.
- **Components:** `MenuBar`, `Dock`, `Desktop` (hero), `MacWindow` (shared chrome for projects / experience / terminal), `Terminal`, per-section components, `ThemeProvider` (CSS variables + class on `<html>`).
- **Rendering:** fully static export of a single route; interactive parts are client components. Metadata + OG image for link unfurls. No backend/DB; contact via `mailto:` and links.
- **Testing:** unit tests for terminal command parser + theme persistence; Playwright smoke (nav, scroll, theme toggle, mobile viewport); Lighthouse ≥90 all categories before deploy.
- **Repo & deploy:** public GitHub repo (`Dxksh/portfolio`) — the code is itself a portfolio artefact. Vercel auto-deploy from `main`. Custom domain: whenever purchased (out of scope for v1).

## 6. Out of Scope (v1)

- Blog, CMS, analytics, contact form backend, custom domain purchase.
- Full portfolio-as-OS mode (no-scroll desktop) — hybrid only.
- Playful decoration layer (stickers/eyes) — rejected by user.

## 7. Open Items

- Final copy pass on all content files by Daksh after build ("sort the info out later" — structure supports this).
- Wallpaper is provisional-approved; may be revisited after seeing it in the real build.
