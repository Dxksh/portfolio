"use client";

import { useEffect, useRef, useState } from "react";
import { MacWindow } from "@/components/mac/MacWindow";
import { profile } from "@/content/profile";
import { runCommand, visibleCommands, type TerminalLine } from "@/lib/terminal";
import { useSound } from "@/components/SoundProvider";

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
  const { playClick } = useSound();

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [entries]);

  function submit(raw: string) {
    playClick();
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
