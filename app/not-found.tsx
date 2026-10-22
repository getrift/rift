import type { Metadata } from "next";
import { LostPage } from "./site-frame";

// The 404 page is built with the home page and the docs, so it shares their
// look. Next wraps it in the root layout and answers with the 404 status.
const title = "Page not found | Onadit";
const description = "This page does not exist.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { title, description, siteName: "Onadit", type: "website" },
  twitter: { card: "summary", title, description },
};

export default function NotFound() {
  return <LostPage />;
}
