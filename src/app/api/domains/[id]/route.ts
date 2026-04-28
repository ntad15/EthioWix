import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { getDomainById, updateDomain } from "@/lib/db/domain-store";

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const domain = await getDomainById(id);
  if (!domain || domain.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(domain);
}

export async function PATCH(request: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const domain = await getDomainById(id);
  if (!domain || domain.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = (await request.json().catch(() => ({}))) as {
    autoRenew?: boolean;
    siteId?: string | null;
  };

  const updated = await updateDomain(id, {
    autoRenew: typeof body.autoRenew === "boolean" ? body.autoRenew : undefined,
    siteId: body.siteId !== undefined ? body.siteId : undefined,
  });
  return NextResponse.json(updated);
}

// DELETE detaches by turning off auto-renew and clearing site_id. Does not delete
// from the registrar — the domain remains registered until natural expiry.
export async function DELETE(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await ctx.params;
  const domain = await getDomainById(id);
  if (!domain || domain.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await updateDomain(id, { autoRenew: false, siteId: null });
  return NextResponse.json({ success: true });
}
