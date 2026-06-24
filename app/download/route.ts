import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// The signed + notarized Apple Silicon .pkg is hosted on GitHub Releases
// (getrift/rift, public). Kept behind /download so the host can move without
// touching any page copy. `latest/download` resolves to the asset named
// `Rift.pkg` on the most recent non-prerelease release.
const PKG_URL =
  "https://github.com/getrift/rift/releases/latest/download/Rift.pkg";

export function GET() {
  return NextResponse.redirect(PKG_URL, { status: 302 });
}
