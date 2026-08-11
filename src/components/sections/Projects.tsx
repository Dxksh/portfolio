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
