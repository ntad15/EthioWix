import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getSitesByUserId, saveSite, getSiteBySlug, getSiteById, deleteSite } from "@/lib/db/site-store";
import { siteConfigSchema } from "@/types/site-config";
import { validateSlug } from "@/lib/utils/validation";

async function getAuthUserId(): Promise<string | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user?.id ?? null;
}

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (id) {
    const site = await getSiteById(id);
    if (!site) {
      return NextResponse.json({ error: "Site not found" }, { status: 404 });
    }
    if (site.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    return NextResponse.json(site);
  }

  const sites = await getSitesByUserId(userId);
  return NextResponse.json(sites);
}

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  body.userId = userId;

  const parsed = siteConfigSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid site config", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const slugError = validateSlug(parsed.data.slug);
  if (slugError) {
    return NextResponse.json({ error: slugError }, { status: 400 });
  }

  const existing = await getSiteBySlug(parsed.data.slug);
  if (existing && existing.id !== parsed.data.id) {
    return NextResponse.json(
      { error: "A site with this slug already exists" },
      { status: 409 }
    );
  }

  const existingById = await getSiteById(parsed.data.id);
  if (existingById && existingById.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const saved = await saveSite(parsed.data);
  return NextResponse.json(saved, { status: existingById ? 200 : 201 });
}

export async function DELETE(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Missing site id" }, { status: 400 });
  }

  const site = await getSiteById(id);
  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 });
  }
  if (site.userId !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteSite(id);
  return NextResponse.json({ success: true });
}
