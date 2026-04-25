import { NextRequest, NextResponse } from "next/server";
import { getSiteBySlug } from "@/lib/db/site-store";

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

  if (!domain.endsWith(`.${rootDomain}`)) {
    return new NextResponse("Not allowed", { status: 404 });
  }

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
