import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";

// The 404 page is built with the home page and the docs (second-brain,
// preview/site-v42/build.py --site public/site), so it shares their look. Next
// wraps it in the root layout and answers with the 404 status, so only its
// font sheet, its theme script, its styles and its body are placed here. The
// file is read once, when the site is built.
const html = readFileSync(join(process.cwd(), "public/site/404.html"), "utf8");
const part = (pattern: RegExp) => html.match(pattern)?.[1] ?? "";
const fonts = part(/<link href="([^"]+)" rel="stylesheet">/);
const theme = part(/<script>([\s\S]*?)<\/script>/);
const styles = part(/<style>([\s\S]*?)<\/style>/);
const body = part(/<body>([\s\S]*)<\/body>/);
if (!fonts || !theme || !styles || !body) {
  throw new Error("public/site/404.html is not in the shape app/not-found.tsx expects");
}

// The root layout puts its own background, text colour and font on <body> with
// classes, which outrank the page's plain `body` rule. This line hands them back.
const layoutOverride =
  ':root body { background: var(--bg); color: var(--txt); font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif; }';

const title = "Page not found | Onadit";
const description = "This page does not exist.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  openGraph: { title, description, siteName: "Onadit", type: "website" },
  twitter: { card: "summary", title, description },
};

export default function NotFound() {
  return (
    <>
      <link rel="stylesheet" href={fonts} />
      <script dangerouslySetInnerHTML={{ __html: theme }} />
      <style dangerouslySetInnerHTML={{ __html: `${styles}\n${layoutOverride}` }} />
      <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
