import { NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";
import { getAuthUserId } from "@/lib/domains/auth";
import { isValidLabel, normalizeDomain, splitDomain, isSupportedTld } from "@/lib/domains/validation";
import { checkDomain } from "@/lib/registrar/porkbun";
import { getPriceBirr } from "@/lib/domains/pricing";
import { initialize } from "@/lib/payments/chapa";
import { assertOwnedSite } from "@/lib/domains/sites";
import {
  createDomain,
  createDomainOrder,
  updateDomainOrder,
} from "@/lib/db/domain-store";

type Body = {
  domainName: string;
  siteId?: string;
  ownerContact: { name: string; email: string; phone: string };
};

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Partial<Body>;
  if (!body.domainName || !body.ownerContact?.email || !body.ownerContact?.name) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const normalized = normalizeDomain(body.domainName);
  const split = splitDomain(normalized);
  if (!split || !isValidLabel(split.label) || !isSupportedTld(split.tld)) {
    return NextResponse.json({ error: "Unsupported domain" }, { status: 400 });
  }

  const siteAccess = await assertOwnedSite(body.siteId, userId);
  if (!siteAccess.ok) {
    return NextResponse.json({ error: siteAccess.error }, { status: siteAccess.status });
  }
  const siteId = siteAccess.siteId || null;

  // Re-check availability right before charging to minimize race window.
  const avail = await checkDomain(normalized);
  if (!avail.ok) {
    return NextResponse.json({ error: `Registry check failed: ${avail.message}` }, { status: 502 });
  }
  if (!avail.data.available) {
    return NextResponse.json({ error: "Domain is no longer available" }, { status: 409 });
  }
  if (avail.data.premium) {
    return NextResponse.json({ error: "Premium domains are not supported in v1" }, { status: 400 });
  }

  const priceBirr = getPriceBirr(split.tld);
  const txRef = `dom_${crypto.randomBytes(12).toString("hex")}`;

  const order = await createDomainOrder(
    {
      userId,
      domainName: normalized,
      tld: split.tld,
      priceBirr,
      kind: "INITIAL",
      status: "PENDING_PAYMENT",
      chapaTxRef: txRef,
    },
    { admin: true }
  );

  // Behind a reverse proxy (Caddy), nextUrl.origin reflects the internal listen address.
  // Read the forwarded headers so the URL we hand Chapa is what the browser actually sees.
  const proto = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(/:$/, "");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host;
  const origin = `${proto}://${host}`;
  const init = await initialize({
    amountBirr: priceBirr,
    txRef,
    email: body.ownerContact.email,
    firstName: body.ownerContact.name.split(" ")[0],
    lastName: body.ownerContact.name.split(" ").slice(1).join(" ") || body.ownerContact.name,
    callbackUrl: `${origin}/api/webhooks/chapa`,
    returnUrl: `${origin}/settings/domain?${siteId ? `siteId=${siteId}&` : ""}order=${order.id}`,
    customTitle: `Domain: ${normalized}`,
  });

  if (!init.ok) {
    await updateDomainOrder(
      order.id,
      { status: "FAILED", failureReason: `Chapa init: ${init.message}` },
      { admin: true }
    );
    return NextResponse.json({ error: "Payment init failed" }, { status: 502 });
  }

  // Stash beneficial-owner contact on a placeholder Domain so we don't lose it before registration.
  const domain = await createDomain({
    name: normalized,
    tld: split.tld,
    siteId,
    userId,
    source: "REGISTERED",
    status: "PENDING",
    ownerName: body.ownerContact.name,
    ownerEmail: body.ownerContact.email,
    ownerPhone: body.ownerContact.phone,
  });

  await updateDomainOrder(order.id, { domainId: domain.id }, { admin: true });

  return NextResponse.json({
    orderId: order.id,
    txRef,
    checkoutUrl: init.data.checkoutUrl,
  });
}
