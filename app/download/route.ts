import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The signed + notarized Apple Silicon .pkg is hosted on GitHub Releases
// (getrift/rift, public). Kept behind /download so the host can move without
// touching any page copy. `latest/download` resolves to the asset named
// `Onadit.pkg` on the most recent non-prerelease release (1.0.0 and later
// also carry the same file as `Rift.pkg`, for links made before the rename).
const PKG_URL =
  "https://github.com/getrift/rift/releases/latest/download/Onadit.pkg";

export function GET() {
  return NextResponse.redirect(PKG_URL, { status: 302 });
}
