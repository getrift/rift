import type { Metadata } from "next";
import { Geist, Geist_Mono, Lora } from "next/font/google";
import { OG_IMAGE, OG_VIDEO } from "./seo";
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

// Cloudflare Web Analytics. The token is public: it ships in every page.
const CF_BEACON = JSON.stringify({ token: "2e1fb079b71d4e048089611adebdb05b" });

// Site default — the home page inherits all of this. Other routes override
// title/description and provide their own canonical + social block via
// socialMeta(); the OG image (public/og.png) and video (public/og.mp4) are shared everywhere.
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
    videos: [OG_VIDEO],
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
      <body className="bg-canvas font-sans text-ink">
        {children}
        {/* Production deploys only, so previews and localhost aren't counted. */}
        {process.env.VERCEL_ENV === "production" && (
          <script
            type="module"
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={CF_BEACON}
          />
        )}
      </body>
    </html>
  );
}
