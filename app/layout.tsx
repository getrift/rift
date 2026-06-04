import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

const lora = Lora({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getrift.dev"),
  title: "Rift — Search your AI history, reuse it in your coding agents",
  description:
    "Rift turns ChatGPT, Claude, Grok, and Gemini exports into a searchable local archive on your Mac — source-backed first, reusable in Claude Code, Cursor, and Codex after setup.",
  keywords: [
    "Rift",
    "AI memory",
    "MCP",
    "Claude",
    "Codex",
    "Cursor",
    "ChatGPT",
    "Gemini",
    "local-first",
  ],
  openGraph: {
    title: "Rift — Search your AI history, reuse it in your coding agents",
    description:
      "Turn AI exports into a searchable local archive with sources, then reuse that context in Claude Code, Cursor, and Codex.",
    url: "https://getrift.dev",
    siteName: "Rift",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Rift — Search your AI history, reuse it in your coding agents",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rift — Search your AI history, reuse it in your coding agents",
    description:
      "Turn AI exports into a searchable local archive with sources, then reuse that context in Claude Code, Cursor, and Codex.",
    images: ["/og-image.svg"],
  },
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${lora.variable}`}
    >
      <body className="bg-[#08090a] font-sans text-[#f7f8f8]">{children}</body>
    </html>
  );
}
