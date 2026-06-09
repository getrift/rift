import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { OG_IMAGE } from "./seo";
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

// Site default — the home page inherits all of this. Other routes override
// title/description and provide their own canonical + social block via
// socialMeta(); the OG image (public/og.png) is shared everywhere.
const SITE_TITLE = "Rift — a private memory your AI agents share";
const SITE_DESCRIPTION =
  "A smart, private memory that lives on your Mac. Any agent that speaks MCP can reach it and pull only the context that matters — so you never re-explain yourself.";

export const metadata: Metadata = {
  metadataBase: new URL("https://getrift.dev"),
  title: {
    default: SITE_TITLE,
    template: "%s · Rift",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Rift",
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
  alternates: { canonical: "/" },
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: "/",
    siteName: "Rift",
    type: "website",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: [OG_IMAGE.url],
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/apple-touch-icon.png",
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
      <body className="bg-canvas font-sans text-ink">{children}</body>
    </html>
  );
}
