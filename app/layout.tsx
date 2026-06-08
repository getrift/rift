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
  title: "Rift — a private AI memory your coding agents share",
  description:
    "A private, local memory for your AI tools. Rift indexes your ChatGPT, Claude, and Gemini chats on your Mac and feeds Claude Code, Cursor, and Codex the exact context they need — so you never re-explain what you already solved.",
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
    title: "Rift — a private AI memory your coding agents share",
    description:
      "A private, local memory your AI coding agents share — Rift keeps your chats current and feeds Claude Code, Cursor, and Codex exactly the context they need.",
    url: "https://getrift.dev",
    siteName: "Rift",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Rift — a private AI memory your coding agents share",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rift — a private AI memory your coding agents share",
    description:
      "A private, local memory your AI coding agents share — Rift keeps your chats current and feeds Claude Code, Cursor, and Codex exactly the context they need.",
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
