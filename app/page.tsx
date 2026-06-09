import type { Metadata } from "next";
import HomeContent from "./home-content";

const title = "Rift — a private AI memory your coding agents share";
const description =
  "A private, local memory your AI coding tools share. Rift captures your Claude Code and Codex sessions on your Mac and feeds them back to every MCP tool — Claude Code, Cursor, Codex — so you never re-explain what you already solved.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: {
    title,
    description,
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
    title,
    description,
    images: ["/og-image.svg"],
  },
};

export default function Home() {
  return <HomeContent />;
}
