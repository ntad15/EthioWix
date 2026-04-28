import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { listDomainsBySite, listOrdersBySite } from "@/lib/db/domain-store";

export async function GET(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const siteId = request.nextUrl.searchParams.get("siteId");
  if (!siteId) return NextResponse.json({ error: "Missing siteId" }, { status: 400 });

  const [domains, orders] = await Promise.all([
    listDomainsBySite(siteId, userId),
    listOrdersBySite(siteId, userId),
  ]);

  return NextResponse.json({
    domains: domains.map((d) => ({
      id: d.id,
      name: d.name,
      status: d.status,
      source: d.source,
      registeredAt: d.registeredAt,
      expiresAt: d.expiresAt,
      autoRenew: d.autoRenew,
    })),
    orders: orders.map((o) => ({
      id: o.id,
      domainName: o.domainName,
      kind: o.kind,
      status: o.status,
      priceBirr: o.priceBirr,
      failureReason: o.failureReason,
      createdAt: o.createdAt,
      updatedAt: o.updatedAt,
    })),
  });
}
