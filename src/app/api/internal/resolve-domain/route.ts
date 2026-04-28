import { NextRequest, NextResponse } from "next/server";
import { findActiveDomainByHost } from "@/lib/db/domain-store";
import { getSiteById } from "@/lib/db/site-store";

// Maps a custom host → { slug } if there is an ACTIVE Domain row pointing at a published site.
// Used by middleware to rewrite custom-domain requests onto /sites/{slug}.
export async function GET(request: NextRequest) {
  const host = request.nextUrl.searchParams.get("host");
  if (!host) return NextResponse.json({ error: "Missing host" }, { status: 400 });

  const domain = await findActiveDomainByHost(host);
  if (!domain?.siteId) return NextResponse.json({ slug: null });

  const site = await getSiteById(domain.siteId);
  if (!site || !site.published) return NextResponse.json({ slug: null });

  return NextResponse.json({ slug: site.slug });
}
