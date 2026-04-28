import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import {
  countFailedRenewalOrders,
  createDomainOrder,
  getPaymentMethodByUserId,
  listExpiringRegisteredDomains,
  updateDomain,
  updateDomainOrder,
} from "@/lib/db/domain-store";
import { chargeToken } from "@/lib/payments/chapa";
import { renewDomain } from "@/lib/registrar/porkbun";
import { getPriceBirr } from "@/lib/domains/pricing";
import { isSupportedTld } from "@/lib/domains/validation";

const RENEWAL_WINDOW_DAYS = 30;
const MAX_FAILED_ATTEMPTS = 3;

type RenewOutcome = {
  domainId: string;
  name: string;
  status: "RENEWED" | "CHARGE_FAILED" | "REGISTRAR_FAILED" | "SKIPPED" | "LAPSED";
  message?: string;
};

export async function POST(request: NextRequest) {
  const secret = process.env.DOMAIN_CRON_SECRET;
  if (!secret) return NextResponse.json({ error: "Cron secret not configured" }, { status: 500 });
  const provided = request.headers.get("x-cron-secret");
  if (provided !== secret) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const cutoff = new Date(Date.now() + RENEWAL_WINDOW_DAYS * 24 * 60 * 60 * 1000).toISOString();
  const candidates = await listExpiringRegisteredDomains(cutoff);

  const outcomes: RenewOutcome[] = [];

  for (const d of candidates) {
    if (!isSupportedTld(d.tld)) {
      outcomes.push({ domainId: d.id, name: d.name, status: "SKIPPED", message: "Unsupported TLD" });
      continue;
    }

    const priorFailed = await countFailedRenewalOrders(d.id);
    if (priorFailed >= MAX_FAILED_ATTEMPTS) {
      await updateDomain(d.id, { status: "EXPIRED" }, { admin: true });
      outcomes.push({ domainId: d.id, name: d.name, status: "LAPSED" });
      continue;
    }

    const pm = await getPaymentMethodByUserId(d.userId);
    if (!pm) {
      outcomes.push({
        domainId: d.id,
        name: d.name,
        status: "CHARGE_FAILED",
        message: "No stored payment method",
      });
      continue;
    }

    const priceBirr = getPriceBirr(d.tld);
    const txRef = `dom_renew_${crypto.randomBytes(8).toString("hex")}`;

    const order = await createDomainOrder(
      {
        domainId: d.id,
        userId: d.userId,
        domainName: d.name,
        tld: d.tld,
        priceBirr,
        kind: "RENEWAL",
        status: "PENDING_PAYMENT",
        chapaTxRef: txRef,
      },
      { admin: true }
    );

    const charge = await chargeToken({
      customerId: pm.chapaCustomerId,
      amountBirr: priceBirr,
      txRef,
      email: d.ownerEmail ?? "",
    });

    if (!charge.ok) {
      await updateDomainOrder(
        order.id,
        { status: "FAILED", failureReason: `Chapa charge: ${charge.message}` },
        { admin: true }
      );
      outcomes.push({
        domainId: d.id,
        name: d.name,
        status: "CHARGE_FAILED",
        message: charge.message,
      });
      continue;
    }

    await updateDomainOrder(
      order.id,
      { status: "PAID", chapaChargeId: charge.data.chargeId },
      { admin: true }
    );

    const renew = await renewDomain(d.name, 1);
    if (!renew.ok) {
      await updateDomainOrder(
        order.id,
        { status: "FAILED", failureReason: `Porkbun renew: ${renew.message}` },
        { admin: true }
      );
      outcomes.push({
        domainId: d.id,
        name: d.name,
        status: "REGISTRAR_FAILED",
        message: renew.message,
      });
      continue;
    }

    if (renew.data.expiresAt) {
      await updateDomain(
        d.id,
        { expiresAt: new Date(renew.data.expiresAt) },
        { admin: true }
      );
    }
    await updateDomainOrder(order.id, { status: "REGISTERED" }, { admin: true });
    outcomes.push({ domainId: d.id, name: d.name, status: "RENEWED" });
  }

  return NextResponse.json({ processed: outcomes.length, outcomes });
}
