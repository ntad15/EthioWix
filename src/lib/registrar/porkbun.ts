import type {
  Result,
  CheckDomainResult,
  CreateDomainArgs,
  CreateDomainResult,
  RenewDomainResult,
  DnsRecord,
} from "./types";

const PORKBUN_BASE = "https://api.porkbun.com/api/json/v3";

function getCreds() {
  const apikey = process.env.PORKBUN_API_KEY;
  const secretapikey = process.env.PORKBUN_SECRET_API_KEY;
  if (!apikey || !secretapikey) {
    throw new Error("PORKBUN_API_KEY and PORKBUN_SECRET_API_KEY must be set");
  }
  return { apikey, secretapikey };
}

async function call<T>(path: string, body: Record<string, unknown> = {}): Promise<Result<T>> {
  const url = `${PORKBUN_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...getCreds(), ...body }),
      cache: "no-store",
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    console.error("[porkbun] network error", { path, message });
    return { ok: false, code: "NETWORK", message };
  }

  const rawText = await res.text();
  let json: unknown;
  try {
    json = JSON.parse(rawText);
  } catch {
    console.error("[porkbun] non-JSON response", {
      path,
      status: res.status,
      contentType: res.headers.get("content-type"),
      bodyPreview: rawText.slice(0, 500),
      requestBody: body,
    });
    return { ok: false, code: "BAD_RESPONSE", message: `Non-JSON response (${res.status})` };
  }

  const obj = json as { status?: string; message?: string };
  if (obj.status !== "SUCCESS") {
    console.error("[porkbun] api error", {
      path,
      httpStatus: res.status,
      apiStatus: obj.status,
      apiMessage: obj.message,
      requestBody: body,
      responseBody: json,
    });
    return {
      ok: false,
      code: res.ok ? "API_ERROR" : `HTTP_${res.status}`,
      message: obj.message ?? `Request failed (${res.status})`,
    };
  }
  return { ok: true, data: json as T };
}

export type PricingResponse = {
  pricing: Record<string, { registration: string; renewal: string; transfer: string }>;
};

export async function getPricing(): Promise<Result<PricingResponse>> {
  return call<PricingResponse>("/pricing/get");
}

export async function checkDomain(domain: string): Promise<Result<CheckDomainResult>> {
  type Raw = {
    response: { avail: "yes" | "no"; premium: "yes" | "no"; price?: string };
  };
  const r = await call<Raw>(`/domain/checkDomain/${domain}`);
  if (!r.ok) return r;
  return {
    ok: true,
    data: {
      available: r.data.response.avail === "yes",
      premium: r.data.response.premium === "yes",
      priceUsd: r.data.response.price ? Number(r.data.response.price) : undefined,
    },
  };
}

export async function createDomain(args: CreateDomainArgs): Promise<Result<CreateDomainResult>> {
  type Raw = { domain?: string; expiry?: string; orderID?: string; orderId?: string };
  const r = await call<Raw>("/domain/create", {
    domain: args.domain,
    years: args.years,
    coupon: "",
    whoisprivacy: args.enableWhoisPrivacy === false ? "0" : "1",
    nameservers: [],
    contact: {
      first_name: args.contact.name.split(" ")[0] ?? args.contact.name,
      last_name: args.contact.name.split(" ").slice(1).join(" ") || args.contact.name,
      email: args.contact.email,
      phone: args.contact.phone,
      address1: args.contact.address1,
      city: args.contact.city,
      state: args.contact.state,
      zip: args.contact.postalCode,
      country: args.contact.country,
    },
  });
  if (!r.ok) return r;
  return {
    ok: true,
    data: {
      porkbunOrderId: r.data.orderID ?? r.data.orderId ?? "",
      expiresAt: r.data.expiry ?? "",
    },
  };
}

export async function renewDomain(domain: string, years: number): Promise<Result<RenewDomainResult>> {
  type Raw = { expiry?: string };
  const r = await call<Raw>("/domain/renew", { domain, years });
  if (!r.ok) return r;
  return { ok: true, data: { expiresAt: r.data.expiry ?? "" } };
}

export async function createOrEditDnsRecord(
  domain: string,
  record: DnsRecord
): Promise<Result<{ id?: string }>> {
  return call<{ id?: string }>(`/dns/createOrEdit/${domain}`, {
    type: record.type,
    name: record.name ?? "",
    content: record.content,
    ttl: String(record.ttl ?? 600),
  });
}

