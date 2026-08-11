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
