import type { Metadata } from "next";
import HomeContent from "./home-content";

const title = "Rift — a private AI memory your coding agents share";
const description =
  "A private, local memory for your AI tools. Rift indexes your ChatGPT, Claude, and Gemini chats on your Mac and feeds Claude Code, Cursor, and Codex the exact context they need — so you never re-explain what you already solved.";

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
