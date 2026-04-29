import { NextRequest, NextResponse } from "next/server";
import { getDomainOrderById, updateDomainOrder } from "@/lib/db/domain-store";
import { verify } from "@/lib/payments/chapa";
import { registerDomainForOrder } from "@/lib/jobs/registerDomain";

function amountsMatch(actual: number, expected: number): boolean {
  return Number.isFinite(actual) && Math.abs(actual - expected) < 0.01;
}

// Manual recovery for orders stuck because the Chapa webhook never reached us
// (server was down, Chapa account doesn't expose webhook resend, etc).
// Verifies payment with Chapa server-side, advances PENDING_PAYMENT → PAID,
// then runs the (idempotent) registration job.
export async function POST(request: NextRequest) {
  const secret = process.env.DOMAIN_CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 });
  if (request.headers.get("x-cron-secret") !== secret) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = (await request.json().catch(() => ({}))) as { orderId?: string };
  if (!body.orderId) return NextResponse.json({ error: "Missing orderId" }, { status: 400 });

  const order = await getDomainOrderById(body.orderId);
  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  if (order.status === "PENDING_PAYMENT") {
    const v = await verify(order.chapaTxRef);
    if (!v.ok) {
      return NextResponse.json(
        { error: `Chapa verify failed: ${v.message}` },
        { status: 502 }
      );
    }
    if (v.data.status !== "success") {
      return NextResponse.json(
        { error: `Chapa says status=${v.data.status} — payment not complete` },
        { status: 409 }
      );
    }
    if (!amountsMatch(v.data.amountBirr, order.priceBirr)) {
      await updateDomainOrder(
        order.id,
        {
          status: "FAILED",
          failureReason: `Chapa amount mismatch: expected ${order.priceBirr} ETB, got ${v.data.amountBirr} ETB`,
        },
        { admin: true }
      );
      return NextResponse.json({ error: "Chapa amount did not match order amount" }, { status: 409 });
    }
    await updateDomainOrder(
      order.id,
      { status: "PAID", chapaChargeId: v.data.chargeId },
      { admin: true }
    );
  }

  await registerDomainForOrder(body.orderId);

  const final = await getDomainOrderById(body.orderId);
  return NextResponse.json({
    orderId: body.orderId,
    status: final?.status,
    failureReason: final?.failureReason ?? null,
  });
}
