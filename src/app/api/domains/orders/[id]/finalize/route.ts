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
        { status: order.status, message: `Could not reach Chapa to verify payment: ${v.message}` },
        { status: 200 }
      );
    }
    if (v.data.status === "pending") {
      return NextResponse.json(
        { status: order.status, message: "Chapa is still processing your payment. Try again in a moment." },
        { status: 200 }
      );
    }
    if (v.data.status !== "success") {
      await updateDomainOrder(
        order.id,
        {
          status: "FAILED",
          failureReason: `Payment was not successful at Chapa (status: ${v.data.status}).`,
        },
        { admin: true }
      );
      const failed = await getDomainOrderById(order.id);
      return NextResponse.json({
        status: failed?.status,
        failureReason: failed?.failureReason ?? null,
      });
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
