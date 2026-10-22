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
drawing sheet and its first sentence. `public/og.mp4` is the same card in motion,
an 8.4 s loop that starts and ends on that still: the text fades out, the
sentence is read in word by word as on the home page, the dots come in and
drift, then the button. iMessage and Discord play the video; other apps show the
image.

Both come from `scripts/og-card/card.html` (`?play` turns on the motion), in a
headless Chrome: `scripts/og-card/run.sh public/og.png` for the image,
`node scripts/og-card/video.mjs public/og.mp4` for the video, which sets every
animation to each frame's time so the clip is the same on every run. When the
home page's sentence, look or motion changes, update the card and render both
again. The static pages in `public/site` get their `og:video` tags from the
engine repo's build (`preview/site-v42/build.py`).
