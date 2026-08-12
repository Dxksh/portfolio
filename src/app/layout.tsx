import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import { MotionConfig } from "motion/react";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-tau-lovat-21.vercel.app"),
  title: "Daksh Singhvi — Software Engineer",
  description:
    "Portfolio of Daksh Singhvi — Software Engineer in Liverpool, UK. 1+ years shipping scalable systems. Available for work.",
  openGraph: {
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Available for work in Liverpool, UK.",
    type: "website",
    images: ["/og.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Available for work in Liverpool, UK.",
    images: ["/og.png"],
  },
};

const themeInit = `try{var t=localStorage.getItem("ds-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <noscript>
          <style>{`[style*="opacity:0"]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className={`${mono.variable} antialiased`}>
        <MotionConfig reducedMotion="user">
          <ThemeProvider>{children}</ThemeProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
