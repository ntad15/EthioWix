import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { getDomainOrderById, updateDomainOrder } from "@/lib/db/domain-store";
import { verify, getEvents, classifyEvents } from "@/lib/payments/chapa";
import { registerDomainForOrder } from "@/lib/jobs/registerDomain";

function amountsMatch(actual: number, expected: number): boolean {
  return Number.isFinite(actual) && Math.abs(actual - expected) < 0.01;
}

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
    const verified = await verify(order.chapaTxRef);
    if (verified.ok && verified.data.status === "success") {
      if (!amountsMatch(verified.data.amountBirr, order.priceBirr)) {
        await updateDomainOrder(
          order.id,
          {
            status: "FAILED",
            failureReason: `Chapa amount mismatch: expected ${order.priceBirr} ETB, got ${verified.data.amountBirr} ETB`,
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
        { status: "PAID", chapaChargeId: verified.data.chargeId },
        { admin: true }
      );
    } else if (verified.ok && verified.data.status !== "success") {
      const status = verified.data.status || "unknown";
      const isTerminalFailure = /fail|cancel|declin|expired|refus/i.test(status);
      if (isTerminalFailure) {
        await updateDomainOrder(
          order.id,
          {
            status: "FAILED",
            failureReason: `Payment was not successful at Chapa: ${status}`,
          },
          { admin: true }
        );
        const failed = await getDomainOrderById(order.id);
        return NextResponse.json({
          status: failed?.status,
          failureReason: failed?.failureReason ?? null,
        });
      }

      return NextResponse.json(
        {
          status: order.status,
          message: `Chapa has not confirmed your payment yet. Current status: ${status}.`,
        },
        { status: 200 }
      );
    } else {
      const e = await getEvents(order.chapaTxRef);
      if (!e.ok) {
        return NextResponse.json(
          {
            status: order.status,
            message: `Could not verify payment with Chapa: ${verified.ok ? "Unknown verification result" : verified.message}`,
          },
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

      return NextResponse.json(
        {
          status: order.status,
          message:
            "Chapa events show success, but the official verification endpoint has not confirmed it yet. Please try again shortly.",
        },
        { status: 200 }
      );
    }
  }

  await registerDomainForOrder(order.id);

  const final = await getDomainOrderById(order.id);
  return NextResponse.json({
    status: final?.status,
    failureReason: final?.failureReason ?? null,
  });
}
