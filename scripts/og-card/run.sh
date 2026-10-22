#!/bin/zsh
# Renders onadit.com's share card in a throwaway headless Chrome profile (needs Google Chrome and the network, for Inter).
#   scripts/og-card/run.sh public/og.png
D=${0:A:h}; OUT=${1:A}
PROFILE=$(mktemp -d $D/chrome-XXXX)
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --no-first-run --no-default-browser-check \
  --user-data-dir=$PROFILE --hide-scrollbars --force-device-scale-factor=2 --window-size=1200,630 \
  --virtual-time-budget=5000 --screenshot=$OUT "file://$D/card.html" >/dev/null 2>&1
CODE=$?
rm -rf $PROFILE
exit $CODE
