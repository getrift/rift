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
  title: "Rift – Visual Design Tool for React Components",
  description: "Design React components visually. Adjust spacing, typography, colors, and shadows with real-time preview. Export clean Tailwind CSS code instantly.",
  keywords: ["React", "design tool", "visual editor", "Tailwind CSS", "component design", "UI design", "frontend", "CSS"],
  openGraph: {
    title: "Rift – Visual Design Tool for React Components",
    description: "Design React components visually. Adjust spacing, typography, colors, and shadows with real-time preview. Export clean Tailwind CSS code instantly.",
    url: "https://getrift.dev",
    siteName: "Rift",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Rift – Visual Design Tool for React Components",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rift – Visual Design Tool for React Components",
    description: "Design React components visually. Adjust spacing, typography, colors, and shadows with real-time preview. Export clean Tailwind CSS code instantly.",
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
