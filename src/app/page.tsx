import { Wallpaper } from "@/components/desktop/Wallpaper";
import { MenuBar } from "@/components/chrome/MenuBar";
import { Hero } from "@/components/sections/Hero";

export default function Home() {
  return (
    <>
      <Wallpaper />
      <MenuBar />
      <main className="mx-auto max-w-5xl px-4 sm:px-6">
        <Hero />
      </main>
    </>
  );
}
