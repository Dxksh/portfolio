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
