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
    id: "padelo",
    name: "Padelo",
    impact: "Published on the Play Store (internal release)",
    description:
      "Cross-platform padel scoring and social app — score tracking, social groups, tournaments and detailed statistics, built with Claude Code agentic workflows.",
    tech: ["Flutter", "Dart", "Firebase", "Claude Code"],
    links: [
      { label: "Landing page", href: "https://padelo-web.vercel.app", external: true },
      { label: "Private repo — request access", href: `mailto:${profile.email}?subject=Padelo%20repo%20access`, external: false },
    ],
  },
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
