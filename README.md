# Rift

A Next.js 15 project with Tailwind CSS, Zustand, and CodeMirror.

## Release

Production is the Vercel project `rift`, which serves onadit.com. It is not
connected to GitHub, so merging into `main` releases nothing. To release:
merge the reviewed pull request from a `crog/` branch, `git fetch origin`,
check out the fetched `origin/main` (the merge commit, not a local `main`
that may be stale) in a clean folder with no uncommitted work, copy
`.vercel/project.json` into it, and run `vercel deploy --prod` there. Then check onadit.com in a browser: it sits
behind Vercel's Security Checkpoint, so `curl` gets a challenge page.
