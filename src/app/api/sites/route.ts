import { NextRequest, NextResponse } from "next/server";
import { getAllSites, saveSite, getSiteBySlug, getSiteById, deleteSite } from "@/lib/db/site-store";
import { siteConfigSchema } from "@/types/site-config";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const site = getSiteById(id);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    return NextResponse.json(site);
  }

  const sites = getAllSites();
  return NextResponse.json(sites);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const parsed = siteConfigSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid site config", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Check for slug conflicts
  const existing = getSiteBySlug(parsed.data.slug);
  if (existing && existing.id !== parsed.data.id) {
    return NextResponse.json(
      { error: "A site with this slug already exists" },
      { status: 409 }
    );
  }

  const saved = saveSite(parsed.data);
  return NextResponse.json(saved);
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing site id" }, { status: 400 });
  }

  const deleted = deleteSite(id);
  if (!deleted) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }

  return NextResponse.json({ success: true });
}
