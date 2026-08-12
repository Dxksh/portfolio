import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SoundProvider } from "@/components/SoundProvider";
import { BootOverlay } from "@/components/BootOverlay";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dsinghvi.com"),
  title: "Daksh Singhvi — Software Engineer",
  description:
    "Portfolio of Daksh Singhvi — Software Engineer in Liverpool, UK. 1+ years shipping scalable systems. Open to opportunities.",
  openGraph: {
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Open to opportunities in Liverpool, UK.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Open to opportunities in Liverpool, UK.",
    images: ["/og.png"],
  },
};

const themeInit = `try{var t=localStorage.getItem("ds-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark";var a=localStorage.getItem("ds-accent");document.documentElement.dataset.accent=(a==="ocean"||a==="sunset"||a==="berry")?a:"mint"}catch(e){document.documentElement.dataset.theme="dark";document.documentElement.dataset.accent="mint"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" data-accent="mint" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${mono.variable} antialiased`}>
        <BootOverlay />
        <MotionConfig reducedMotion="user">
          <ThemeProvider>
            <SoundProvider>{children}</SoundProvider>
          </ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
