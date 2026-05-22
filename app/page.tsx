import type { Metadata } from "next";
import HomeContent from "./home-content";

const title = "Rift — Local-first memory for AI tools";
const description =
  "Every AI tool has memory now — locked in its cloud. Rift keeps yours on your own Mac: portable across Claude, Codex, and Cursor, and yours even when you leave a vendor.";

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
        alt: "Rift — Local-first memory for AI tools",
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
