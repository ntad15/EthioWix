import {
  getDomainOrderById,
  updateDomain,
  updateDomainOrder,
} from "@/lib/db/domain-store";
import { createDomain as registrarCreateDomain, createOrEditDnsRecord } from "@/lib/registrar/porkbun";
import { refund } from "@/lib/payments/chapa";
import { getRegistrantContact } from "@/lib/domains/contact";

// Idempotent: safe to invoke multiple times for the same orderId.
// Registers the domain at the registrar, points DNS at FetanSites, and updates DB state.
// On failure after charge, refunds via Chapa and marks order FAILED.
export async function registerDomainForOrder(orderId: string): Promise<void> {
  const order = await getDomainOrderById(orderId);
  if (!order) return;
  if (order.status === "REGISTERED" || order.status === "REFUNDED" || order.status === "FAILED") {
    return;
  }
  if (order.status !== "PAID") return;

  const edgeIp = process.env.FETANSITES_EDGE_IP;
  if (!edgeIp) {
    await updateDomainOrder(
      order.id,
      { status: "FAILED", failureReason: "FETANSITES_EDGE_IP not configured" },
      { admin: true }
    );
    return;
  }

  const create = await registrarCreateDomain({
    domain: order.domainName,
    years: order.years,
    contact: getRegistrantContact(),
    enableWhoisPrivacy: true,
  });

  if (!create.ok) {
    const refundRes = await refund(order.chapaTxRef, `Registration failed: ${create.message}`);
    await updateDomainOrder(
      order.id,
      {
        status: refundRes.ok ? "REFUNDED" : "FAILED",
        failureReason: `Porkbun create: ${create.message}${refundRes.ok ? "" : `; refund failed: ${refundRes.message}`}`,
      },
      { admin: true }
    );
    if (order.domainId) {
      await updateDomain(order.domainId, { status: "FAILED" }, { admin: true });
    }
    return;
  }

  // Point DNS at FetanSites edge. Apex A + www CNAME to apex.
  await createOrEditDnsRecord(order.domainName, { type: "A", name: "", content: edgeIp });
  await createOrEditDnsRecord(order.domainName, {
    type: "CNAME",
    name: "www",
    content: order.domainName,
  });

  const expiresAt = create.data.expiresAt ? new Date(create.data.expiresAt) : null;

  if (order.domainId) {
    await updateDomain(
      order.domainId,
      {
        status: "ACTIVE",
        registeredAt: new Date(),
        expiresAt,
        porkbunOrderId: create.data.porkbunOrderId,
      },
      { admin: true }
    );
  }

  await updateDomainOrder(order.id, { status: "REGISTERED" }, { admin: true });
}
