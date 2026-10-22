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

## Share card

`public/og.png` is the share image of every page: the home page as a still, its
drawing sheet and its sentence. `scripts/og-card/run.sh public/og.png` renders
it from `scripts/og-card/card.html` in a headless Chrome. When the home page's
sentence or look changes, update the card and render it again.

`public/og.mp4` is the earlier card in motion: the particle sphere gathers one
topic's memories, holds and lets go, in a 7.5 s loop. iMessage and Discord play
it; other apps show the image. The video is made by `scripts/og-video/run.sh`: `render.html` holds a
copy of the sphere code in `app/sphere-field.tsx` (pointer parts removed) and
runs it in a headless Chrome. When the sphere changes, update the copy and
rebuild the video. The static pages in `public/site` get their `og:video` tags from
the engine repo's build (`preview/site-v42/build.py`).
