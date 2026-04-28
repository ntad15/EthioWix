import crypto from "node:crypto";
import type { Result } from "@/lib/registrar/types";

const CHAPA_BASE = "https://api.chapa.co/v1";

function getSecret(): string {
  const k = process.env.CHAPA_SECRET_KEY;
  if (!k) throw new Error("CHAPA_SECRET_KEY must be set");
  return k;
}

async function call<T>(
  path: string,
  init: { method?: string; body?: unknown } = {}
): Promise<Result<T>> {
  let res: Response;
  try {
    res = await fetch(`${CHAPA_BASE}${path}`, {
      method: init.method ?? "POST",
      headers: {
        Authorization: `Bearer ${getSecret()}`,
        "Content-Type": "application/json",
      },
      body: init.body ? JSON.stringify(init.body) : undefined,
      cache: "no-store",
    });
  } catch (e) {
    return { ok: false, code: "NETWORK", message: e instanceof Error ? e.message : "Network error" };
  }

  let json: unknown;
  try {
    json = await res.json();
  } catch {
    return { ok: false, code: "BAD_RESPONSE", message: `Non-JSON response (${res.status})` };
  }

  const obj = json as { status?: string; message?: string; data?: unknown };
  if (!res.ok || obj.status !== "success") {
    return {
      ok: false,
      code: res.ok ? "API_ERROR" : `HTTP_${res.status}`,
      message: obj.message ?? `Request failed (${res.status})`,
    };
  }
  return { ok: true, data: obj.data as T };
}

export type InitializeArgs = {
  amountBirr: number;
  txRef: string;
  email: string;
  firstName?: string;
  lastName?: string;
  callbackUrl: string;
  returnUrl: string;
  customTitle?: string;
};

export type InitializeResult = { checkoutUrl: string };

export async function initialize(args: InitializeArgs): Promise<Result<InitializeResult>> {
  type Raw = { checkout_url: string };
  const r = await call<Raw>("/transaction/initialize", {
    body: {
      amount: String(args.amountBirr),
      currency: "ETB",
      email: args.email,
      first_name: args.firstName ?? "Customer",
      last_name: args.lastName ?? "FetanSites",
      tx_ref: args.txRef,
      callback_url: args.callbackUrl,
      return_url: args.returnUrl,
      "customization[title]": args.customTitle ?? "FetanSites Domain",
    },
  });
  if (!r.ok) return r;
  return { ok: true, data: { checkoutUrl: r.data.checkout_url } };
}

export type VerifyResult = {
  status: string;
  amountBirr: number;
  chargeId: string;
  customerId?: string;
};

export async function verify(txRef: string): Promise<Result<VerifyResult>> {
  type Raw = {
    status: string;
    amount: string;
    reference?: string;
    tx_ref?: string;
    customer?: { id?: string | number };
  };
  const r = await call<Raw>(`/transaction/verify/${txRef}`, { method: "GET" });
  if (!r.ok) return r;
  return {
    ok: true,
    data: {
      status: r.data.status,
      amountBirr: Number(r.data.amount),
      chargeId: r.data.reference ?? r.data.tx_ref ?? txRef,
      customerId: r.data.customer?.id ? String(r.data.customer.id) : undefined,
    },
  };
}

export type ChargeTokenArgs = {
  customerId: string;
  amountBirr: number;
  txRef: string;
  email: string;
};

// Tokenized recurring charge against a stored Chapa customer.
// NOTE: requires Direct Charge / tokenization to be enabled on the Chapa account.
export async function chargeToken(args: ChargeTokenArgs): Promise<Result<{ chargeId: string }>> {
  type Raw = { reference?: string; tx_ref?: string };
  const r = await call<Raw>("/charges", {
    body: {
      customer_id: args.customerId,
      amount: String(args.amountBirr),
      currency: "ETB",
      tx_ref: args.txRef,
      email: args.email,
    },
  });
  if (!r.ok) return r;
  return { ok: true, data: { chargeId: r.data.reference ?? r.data.tx_ref ?? args.txRef } };
}

export async function refund(txRef: string, reason?: string): Promise<Result<{ refundId: string }>> {
  type Raw = { refund_id?: string; reference?: string };
  const r = await call<Raw>(`/refund/${txRef}`, {
    body: { reason: reason ?? "Domain registration failed" },
  });
  if (!r.ok) return r;
  return { ok: true, data: { refundId: r.data.refund_id ?? r.data.reference ?? "" } };
}

// Verify Chapa webhook HMAC. Chapa sends `Chapa-Signature` (or `x-chapa-signature`)
// computed as HMAC-SHA256(secret, rawBody).
export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const secret = process.env.CHAPA_WEBHOOK_SECRET ?? process.env.CHAPA_SECRET_KEY;
  if (!secret) return false;
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected, "hex"), Buffer.from(signature, "hex"));
  } catch {
    return false;
  }
}
