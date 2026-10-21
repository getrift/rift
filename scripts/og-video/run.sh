#!/bin/zsh
# Renders onadit.com's og:video in a throwaway headless Chrome profile (needs Google Chrome, node, ffmpeg).
#   CRF=26 scripts/og-video/run.sh "" public/og.mp4        the 7.5 s loop
#   scripts/og-video/run.sh "still=4.0" - /tmp/hold.png     one moment, as a PNG
D=${0:A:h}; PORT=47$((RANDOM % 900 + 100))
node $D/server.mjs $PORT ${2} ${3} &
SRV=$!
sleep 0.5
PROFILE=$(mktemp -d $D/chrome-XXXX)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-first-run --no-default-browser-check \
  --disable-background-timer-throttling --disable-renderer-backgrounding --user-data-dir=$PROFILE \
  --window-size=1200,630 "http://localhost:$PORT/?$1" >/dev/null 2>&1 &
CHR=$!
wait $SRV; CODE=$?
kill $CHR 2>/dev/null; wait $CHR 2>/dev/null; rm -rf $PROFILE
exit $CODE
