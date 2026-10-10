import type { NextConfig } from "next";

// The home page and the docs are static pages built in the engine repo
// (second-brain, preview/site-v42/build.py --site public/site). These rewrites
// serve them at the site's own addresses. They run before the app's routes, so
// app/page.tsx and app/docs are no longer reached; remove the rewrites to get
// them back.
const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        { source: "/", destination: "/site/index.html" },
        { source: "/docs", destination: "/site/docs/index.html" },
        { source: "/docs/search.json", destination: "/site/docs/search.json" },
        { source: "/docs/:page([a-z-]+\\.md)", destination: "/site/docs/:page" },
        { source: "/docs/:page([a-z-]+)", destination: "/site/docs/:page.html" },
        { source: "/llms.txt", destination: "/site/llms.txt" },
        { source: "/llms-full.txt", destination: "/site/llms-full.txt" },
        { source: "/rift.md", destination: "/site/rift.md" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
};

export default nextConfig;
