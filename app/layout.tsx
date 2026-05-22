import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://getrift.dev"),
  title: "Rift — Local-first memory for AI tools",
  description:
    "Rift captures your Claude Code and Codex sessions locally, indexes them on your Mac, and serves memory back to Claude, Codex, and Cursor over MCP.",
  keywords: [
    "Rift",
    "AI memory",
    "MCP",
    "Claude",
    "Codex",
    "Cursor",
    "local-first",
  ],
  openGraph: {
    title: "Rift — Local-first memory for AI tools",
    description:
      "Rift captures your Claude Code and Codex sessions locally, indexes them on your Mac, and serves memory back to Claude, Codex, and Cursor over MCP.",
    url: "https://getrift.dev",
    siteName: "Rift",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Rift — Local-first memory for AI tools",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rift — Local-first memory for AI tools",
    description:
      "Rift captures your Claude Code and Codex sessions locally, indexes them on your Mac, and serves memory back to Claude, Codex, and Cursor over MCP.",
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
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable} dark`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
