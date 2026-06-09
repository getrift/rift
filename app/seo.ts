import type { Metadata } from "next";

/* One shared OG/Twitter card across every page — the locked rift lockup on the
   dark canvas (public/og.png, 1200×630). Per-page <title> and <description>
   still differ; only the image is shared. */
export const OG_IMAGE = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "Rift — one memory, shared by every agent you use.",
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
      siteName: "Rift",
      type: "website",
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [OG_IMAGE.url],
    },
  };
}
