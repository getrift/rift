import type { Metadata } from "next";

/* One shared OG/Twitter card across every page — the home particle-sphere visual
   with the onadit wordmark on the dark canvas (public/og.png, 1200×630). Per-page
   <title> and <description> still differ; only the image is shared. */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Onadit. Local memory all your agents can use.",
} as const;

/* The same card in motion (public/og.mp4, made by scripts/og-card/video.mjs):
   the sentence is read in word by word, then the button. iMessage and Discord
   play it; other apps show OG_IMAGE. Written out in full: Next does not resolve
   video URLs against metadataBase. */
export const OG_VIDEO = {
  url: "https://onadit.com/og.mp4",
  type: "video/mp4",
  width: 1200,
  height: 630,
} as const;

/* Builds the canonical + Open Graph + Twitter block for a page so each route
   only has to state its title, description, and path once. The `title` here is
   the social-card title (og:/twitter:), which can read richer than the short
   <title> a page sets at the top level. */
export function socialMeta({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Pick<Metadata, "alternates" | "openGraph" | "twitter"> {
  return {
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      siteName: "Onadit",
      type: "website",
      images: [OG_IMAGE],
      videos: [OG_VIDEO],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
