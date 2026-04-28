import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { getDomainById, getDomainOrderById } from "@/lib/db/domain-store";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const order = await getDomainOrderById(id);
  if (!order || order.userId !== userId) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const domain = order.domainId ? await getDomainById(order.domainId) : null;

  return NextResponse.json({
    id: order.id,
    status: order.status,
    failureReason: order.failureReason,
    domainName: order.domainName,
    priceBirr: order.priceBirr,
    domain: domain
      ? {
          id: domain.id,
          name: domain.name,
          status: domain.status,
          expiresAt: domain.expiresAt,
        }
      : null,
  });
}
