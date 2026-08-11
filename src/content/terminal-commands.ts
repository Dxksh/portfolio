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
