"use client";

import { motion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { profile } from "@/content/profile";
import { WeatherWidget } from "@/components/widgets/WeatherWidget";
import { NowPlayingWidget } from "@/components/widgets/NowPlayingWidget";

export function Hero() {
  const fade = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" as const, delay },
  });

  return (
    <section id="home" className="relative flex min-h-svh flex-col items-center justify-center px-6 text-center">
      <motion.h1 {...fade(0.15)} className="text-5xl font-bold tracking-tight sm:text-7xl">
        {profile.name}
      </motion.h1>
      <motion.p {...fade(0.3)} className="mt-4 text-xl text-ink-muted sm:text-2xl">
        {profile.role}
      </motion.p>
      <motion.p {...fade(0.4)} className="mt-2 max-w-xl text-balance text-sm text-ink-muted sm:text-base">
        {profile.summary}
      </motion.p>
      <motion.div {...fade(0.55)} className="mt-10 grid w-full max-w-3xl gap-3 sm:grid-cols-2">
        <WeatherWidget />
        <NowPlayingWidget />
      </motion.div>
      <motion.a {...fade(0.8)} href="#about" aria-label="Scroll to About" className="absolute bottom-28 md:bottom-32">
        <ChevronDown className="size-6 animate-bounce text-ink-muted motion-reduce:animate-none" />
      </motion.a>
    </section>
  );
}
