import { NextRequest, NextResponse } from "next/server";
import { getSiteBySlug } from "@/lib/db/site-store";
import { findActiveDomainByHost } from "@/lib/db/domain-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const domain = searchParams.get("domain");
  if (!domain) {
    return new NextResponse("Missing domain", { status: 400 });
  }

  const rootDomain = process.env.DOMAIN;
  if (!rootDomain) {
    return new NextResponse("Server not configured", { status: 500 });
  }

  // Branch 1: subdomain of fetansites root → check sites by slug.
  if (domain.endsWith(`.${rootDomain}`)) {
    const slug = domain.slice(0, -(rootDomain.length + 1));
    if (!slug || slug === "www") {
      return new NextResponse("Not allowed", { status: 404 });
    }
    const site = await getSiteBySlug(slug);
    if (!site || !site.published) {
      return new NextResponse("Site not found", { status: 404 });
    }
    return new NextResponse("OK", { status: 200 });
  }

  // Branch 2: custom domain (REGISTERED or EXTERNAL) — must exist and be ACTIVE.
  const match = await findActiveDomainByHost(domain);
  if (!match) {
    return new NextResponse("Not allowed", { status: 404 });
  }
  return new NextResponse("OK", { status: 200 });
}
