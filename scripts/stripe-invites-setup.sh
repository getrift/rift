#!/bin/zsh
# Makes what the launch invites need in Stripe, in the account the Stripe CLI
# uses (`stripe login`, or STRIPE_API_KEY). Test mode unless you pass --live.
#   scripts/stripe-invites-setup.sh            the 2 invite coupons, in test mode
#   scripts/stripe-invites-setup.sh --price    the coupons, and the €5 monthly plan, VAT included
#   scripts/stripe-invites-setup.sh --live     the coupons, in live mode
# The coupon ids are fixed: app/invites.ts names them. Running it twice only
# reports that they exist.
set -u
LIVE=(); PRICE=0
for arg in "$@"; do
  case $arg in
    --live) LIVE=(--live) ;;
    --price) PRICE=1 ;;
    *) print -u2 "unknown option: $arg"; exit 2 ;;
  esac
done

# which mode an object landed in: a key can be live even without --live
mode() { [[ $1 == *'"livemode": true'* ]] && print live || print test; }

# The CLI exits 0 on API errors too, so the answer itself says what happened.
coupon() {
  local out=$(stripe coupons create $LIVE -d id=$1 -d percent_off=100 -d duration=$2 -d name="$3" 2>&1)
  if [[ $out == *'"object": "coupon"'* ]]; then
    print "made coupon $1 ($(mode $out))"
  elif [[ $out == *resource_already_exists* ]]; then
    print "coupon $1 already exists"
  else
    print -u2 "$out"; exit 1
  fi
}
coupon onadit-invite-first-month once "First month free, from a friend"
coupon onadit-invite-lifetime forever "Free for life: 16 friends invited"

if (( PRICE )); then
  # VAT included in the €5 (a price's tax_behavior can't change once set), taxed as
  # "Software as a service (SaaS) - electronic download - personal use"
  out=$(stripe products create $LIVE -d name=Onadit -d tax_code=txcd_10103100 \
    -d "description=Onadit for Mac. 1 license for every connected app." \
    -d "default_price_data[currency]=eur" -d "default_price_data[unit_amount]=500" \
    -d "default_price_data[tax_behavior]=inclusive" \
    -d "default_price_data[recurring][interval]=month" 2>&1)
  price=$(print -r -- $out | grep -m1 '"default_price"' | sed 's/.*"default_price": "\(price_[^"]*\)".*/\1/')
  [[ $price == price_* ]] || { print -u2 "$out"; exit 1; }
  print "STRIPE_PRICE_ID=$price ($(mode $out))"
fi
