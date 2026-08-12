<h1 align="center">Portfolio</h1>

<p align="center">
  My personal portfolio — a macOS-desktop-themed one-pager with a real terminal, a magnifying dock, and draggable project windows.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Motion" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
</p>

<p align="center">
  <a href="https://www.dsinghvi.com"><strong>🔗 View live site</strong></a>
</p>

---

## ✨ Features

- **🖥️ Menu bar** — scrollspy section links, live clock, and an "About This Dev" popover.
- **🚀 Magnifying dock** — cursor-distance icon scaling, click bounce, and running-app indicator dots.
- **🪟 Draggable windows** — project cards behave like real mac windows; close one and it minimises to a shelf.
- **⌨️ A real terminal** — `whoami`, `skills`, `experience`, `sudo hire-me`, and a couple of hidden commands.
- **🌗 Dark & light themes** — "Night Hills" and "Day Hills" wallpapers, persisted toggle.
- **♿ Accessible motion** — full `prefers-reduced-motion` support via `MotionConfig`; Lighthouse 100/98/100/100/100/100.
- **🧪 Tested** — Vitest over the terminal parser and theme logic, Playwright smoke tests over the built static export.

## 🧱 Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16, App Router, static export |
| Language | TypeScript |
| UI | React 19 |
| Styling | Tailwind CSS 4 |
| Animation | Motion |
| Testing | Vitest, Playwright |
| Deploy | Vercel |

## 🚀 Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Static export to `out/` |
| `npm run lint` | ESLint via `eslint-config-next` |
| `npm test` | Run the Vitest unit suite |
| `npm run test:e2e` | Run the Playwright smoke suite against a production build |

## 📁 Project structure

```
src/
  app/
    layout.tsx           root layout — fonts, metadata, theme init, MotionConfig
    page.tsx              composes the five sections
  components/
    ThemeProvider.tsx      dark/light theme context + localStorage persistence
    Reveal.tsx              shared scroll-reveal wrapper
    SectionHeader.tsx       shared eyebrow/title/blurb header
    icons.tsx               GitHub/LinkedIn brand SVGs (lucide-react drops these)
    chrome/
      MenuBar.tsx           top bar — scrollspy, clock, popover, theme toggle
      Dock.tsx              magnifying dock + mobile tab bar
    desktop/
      Wallpaper.tsx         seeded-star Night/Day Hills SVG background
    mac/
      MacWindow.tsx         shared window chrome (traffic lights, title bar)
    terminal/
      Terminal.tsx          interactive terminal UI
    sections/
      Hero.tsx, About.tsx, Experience.tsx, Projects.tsx, Contact.tsx
  content/
    profile.ts, experience.ts, projects.ts, terminal-commands.ts
    — all copy lives here; edit these files, not the components
  lib/
    theme.ts                pure theme logic (+ theme.test.ts)
    terminal.ts              terminal command parser (+ terminal.test.ts)
    sections.ts, use-active-section.ts, use-media-query.ts
tests/e2e/
  smoke.spec.ts             Playwright suite over the static export
```

---

<p align="center">
  Built by <a href="https://github.com/Dxksh">Daksh Singhvi</a>
</p>
