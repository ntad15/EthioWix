import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { getDomainOrderById, updateDomainOrder } from "@/lib/db/domain-store";
import { verify } from "@/lib/payments/chapa";
import { registerDomainForOrder } from "@/lib/jobs/registerDomain";

// User-triggered finalize: called by the dashboard when the browser lands back from Chapa.
// Verifies payment server-side with Chapa, advances PENDING_PAYMENT → PAID, then runs the
// (idempotent) registration job. Acts as a redundant path so we don't depend on the webhook.
export async function POST(
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

  if (order.status === "PENDING_PAYMENT") {
    const v = await verify(order.chapaTxRef);
    if (!v.ok) {
      return NextResponse.json(
        { status: order.status, message: `Chapa verify failed: ${v.message}` },
        { status: 200 }
      );
    }
    if (v.data.status !== "success") {
      return NextResponse.json(
        { status: order.status, message: `Payment not yet confirmed (${v.data.status})` },
        { status: 200 }
      );
    }
    await updateDomainOrder(
      order.id,
      { status: "PAID", chapaChargeId: v.data.chargeId },
      { admin: true }
    );
  }

  await registerDomainForOrder(order.id);

  const final = await getDomainOrderById(order.id);
  return NextResponse.json({
    status: final?.status,
    failureReason: final?.failureReason ?? null,
  });
}
