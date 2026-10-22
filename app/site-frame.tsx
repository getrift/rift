import { readFileSync } from "node:fs";
import { join } from "node:path";

// The home page, the docs and the 404 page are built in the engine repo
// (second-brain, preview/site-v42/build.py --site public/site). Pages made here
// borrow their look from the built 404 page: its font sheet, its theme script,
// its styles, and its top bar and footer around a page's own content. The file
// is read once, when the site is built.
const html = readFileSync(join(process.cwd(), "public/site/404.html"), "utf8");
const part = (pattern: RegExp) => html.match(pattern)?.[1] ?? "";
export const frame = {
  fonts: part(/<link href="([^"]+)" rel="stylesheet">/),
  theme: part(/<script>([\s\S]*?)<\/script>/),
  styles: part(/<style>([\s\S]*?)<\/style>/),
  body: part(/<body>([\s\S]*)<\/body>/),
  bar: part(/(<header class="bar">[\s\S]*?<\/header>)/),
  footer: part(/(<footer>[\s\S]*?<\/footer>)/),
};
if (Object.values(frame).some((value) => !value)) {
  throw new Error("public/site/404.html is not in the shape app/site-frame.tsx expects");
}

// The root layout puts its own background, text colour and font on <body> with
// classes, which outrank the page's plain `body` rule. This line hands them back.
const layoutOverride =
  ':root body { background: var(--bg); color: var(--txt); font-family: Inter, ui-sans-serif, system-ui, -apple-system, "Helvetica Neue", sans-serif; }';

const Html = ({ html }: { html: string }) => (
  <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: html }} />
);

function Head({ css = "" }: { css?: string }) {
  return (
    <>
      <link rel="stylesheet" href={frame.fonts} />
      <script dangerouslySetInnerHTML={{ __html: frame.theme }} />
      <style dangerouslySetInnerHTML={{ __html: `${frame.styles}\n${layoutOverride}\n${css}` }} />
    </>
  );
}

// The built 404 page, whole.
export function LostPage() {
  return (
    <>
      <Head />
      <Html html={frame.body} />
    </>
  );
}

// The site's top bar and footer around `children`, which go in its drawing
// sheet. `css` adds to the site's styles.
export function SitePage({ css, children }: { css?: string; children: React.ReactNode }) {
  return (
    <>
      <Head css={css} />
      <Html html={frame.bar} />
      <main>
        <div className="sheet">{children}</div>
      </main>
      <Html html={frame.footer} />
    </>
  );
}
