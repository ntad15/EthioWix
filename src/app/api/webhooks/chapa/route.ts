import { NextRequest, NextResponse } from "next/server";
import {
  getDomainOrderByTxRef,
  updateDomainOrder,
} from "@/lib/db/domain-store";
import { verify, verifyWebhookSignature } from "@/lib/payments/chapa";
import { registerDomainForOrder } from "@/lib/jobs/registerDomain";

function amountsMatch(actual: number, expected: number): boolean {
  return Number.isFinite(actual) && Math.abs(actual - expected) < 0.01;
}

export async function POST(request: NextRequest) {
  const raw = await request.text();
  const sig =
    request.headers.get("chapa-signature") ??
    request.headers.get("x-chapa-signature");

  if (!verifyWebhookSignature(raw, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: { tx_ref?: string; status?: string; event?: string };
  try {
    payload = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const txRef = payload.tx_ref;
  if (!txRef) return NextResponse.json({ error: "Missing tx_ref" }, { status: 400 });

  const order = await getDomainOrderByTxRef(txRef);
  if (!order) return NextResponse.json({ error: "Unknown order" }, { status: 404 });

  // Idempotent: already past PENDING_PAYMENT means nothing to do here.
  if (order.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ ok: true, status: order.status });
  }

  // Trust-but-verify: confirm with Chapa server-to-server.
  const v = await verify(txRef);
  if (!v.ok || v.data.status !== "success") {
    await updateDomainOrder(
      order.id,
      {
        status: "FAILED",
        failureReason: v.ok ? `Chapa verify status: ${v.data.status}` : `Chapa verify: ${v.message}`,
      },
      { admin: true }
    );
    return NextResponse.json({ ok: false }, { status: 200 });
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
    return NextResponse.json({ ok: false }, { status: 200 });
  }

  await updateDomainOrder(
    order.id,
    { status: "PAID", chapaChargeId: v.data.chargeId },
    { admin: true }
  );

  // v1: invoke register inline. Chapa retries 5xx; we always return 200 to ack receipt
  // (the registration result is independently visible on the order row).
  try {
    await registerDomainForOrder(order.id);
  } catch (e) {
    await updateDomainOrder(
      order.id,
      {
        status: "FAILED",
        failureReason: `register job threw: ${e instanceof Error ? e.message : String(e)}`,
      },
      { admin: true }
    );
  }

  return NextResponse.json({ ok: true });
}
