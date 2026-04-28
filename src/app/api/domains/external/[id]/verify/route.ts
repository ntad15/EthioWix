import { NextRequest, NextResponse } from "next/server";
import { promises as dns } from "node:dns";
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
  if (domain.source !== "EXTERNAL") {
    return NextResponse.json({ error: "Not an external domain" }, { status: 400 });
  }

  const edgeIp = process.env.FETANSITES_EDGE_IP;
  if (!edgeIp) return NextResponse.json({ error: "Edge IP not configured" }, { status: 500 });

  let resolved: string[] = [];
  try {
    resolved = await dns.resolve4(domain.name);
  } catch {
    return NextResponse.json({ verified: false, reason: "DNS lookup failed" });
  }

  const verified = resolved.includes(edgeIp);
  if (verified && domain.status !== "ACTIVE") {
    await updateDomain(domain.id, {
      status: "ACTIVE",
      registeredAt: domain.registeredAt ?? new Date(),
    });
  }

  return NextResponse.json({ verified, resolved, expected: edgeIp });
}
