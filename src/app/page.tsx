import { Dock } from "@/components/chrome/Dock";
import { MenuBar } from "@/components/chrome/MenuBar";
import { Wallpaper } from "@/components/desktop/Wallpaper";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Experience } from "@/components/sections/Experience";
import { Hero } from "@/components/sections/Hero";
import { Photos } from "@/components/sections/Photos";
import { Projects } from "@/components/sections/Projects";

export default function Home() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[200] focus:rounded focus:bg-accent focus:px-3 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Wallpaper />
      <MenuBar />
      <main id="main-content" className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Photos />
        <Contact />
      </main>
      <Dock />
    </>
  );
}
