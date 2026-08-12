# Daksh Singhvi — Portfolio

A macOS-desktop-themed portfolio, built as a fully static Next.js one-pager.
Dark "Night Hills" by default, light "Day Hills" behind the menu-bar toggle.

**Live:** https://portfolio-tau-lovat-21.vercel.app

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
