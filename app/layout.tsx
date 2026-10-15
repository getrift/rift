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
const SITE_TITLE = "Onadit. Local memory all your agents can use.";
const SITE_DESCRIPTION =
  "Onadit keeps your AI conversations on your Mac, so the agents you connect can look up what you already worked out.";

export const metadata: Metadata = {
  metadataBase: new URL("https://onadit.com"),
  title: {
    default: SITE_TITLE,
    template: "%s · Onadit",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Onadit",
  keywords: [
    "Onadit",
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
    siteName: "Onadit",
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
