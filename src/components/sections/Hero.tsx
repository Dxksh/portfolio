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
