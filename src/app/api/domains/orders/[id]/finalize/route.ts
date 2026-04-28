import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { getDomainOrderById, updateDomainOrder } from "@/lib/db/domain-store";
import { getEvents, classifyEvents } from "@/lib/payments/chapa";
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
    const e = await getEvents(order.chapaTxRef);
    if (!e.ok) {
      return NextResponse.json(
        { status: order.status, message: `Could not reach Chapa to fetch transaction events: ${e.message}` },
        { status: 200 }
      );
    }
    const verdict = classifyEvents(e.data);
    if (verdict === "pending") {
      return NextResponse.json(
        {
          status: order.status,
          message: "Chapa hasn't confirmed your payment yet. Please wait a moment and try again.",
        },
        { status: 200 }
      );
    }
    if (verdict === "failed") {
      const reason = e.data.find((ev) => typeof ev.message === "string")?.message;
      await updateDomainOrder(
        order.id,
        {
          status: "FAILED",
          failureReason: reason
            ? `Payment was not successful at Chapa: ${reason}`
            : "Payment was not successful at Chapa.",
        },
        { admin: true }
      );
      const failed = await getDomainOrderById(order.id);
      return NextResponse.json({
        status: failed?.status,
        failureReason: failed?.failureReason ?? null,
      });
    }
    // verdict === "success"
    await updateDomainOrder(
      order.id,
      { status: "PAID", chapaChargeId: order.chapaTxRef },
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
