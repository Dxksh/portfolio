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
      <Wallpaper />
      <MenuBar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6">
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
