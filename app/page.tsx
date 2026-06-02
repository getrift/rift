import type { Metadata } from "next";
import HomeContent from "./home-content";

const title = "Rift — Make your AI work compound";
const description =
  "Rift turns ChatGPT, Claude, Grok, and Gemini exports into a searchable local archive on your Mac — source-backed first, reusable in Claude Code, Cursor, and Codex after setup.";

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
        alt: "Rift — Make your AI work compound",
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
