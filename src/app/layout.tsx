import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  metadataBase: new URL("https://dxksh-portfolio.vercel.app"), // PROVISIONAL — set to real URL after first deploy
  title: "Daksh Singhvi — Software Engineer",
  description:
    "Portfolio of Daksh Singhvi — Software Engineer in Liverpool, UK. 1+ years shipping scalable systems. Available for work.",
  openGraph: {
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Available for work in Liverpool, UK.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Daksh Singhvi — Software Engineer",
    description:
      "1+ years shipping scalable systems. Available for work in Liverpool, UK.",
  },
};

const themeInit = `try{var t=localStorage.getItem("ds-theme");document.documentElement.dataset.theme=t==="light"?"light":"dark"}catch(e){document.documentElement.dataset.theme="dark"}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className={`${mono.variable} antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
