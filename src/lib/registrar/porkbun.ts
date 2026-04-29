import type {
  Result,
  CheckDomainResult,
  CreateDomainArgs,
  CreateDomainResult,
  RenewDomainResult,
  DnsRecord,
} from "./types";

const PORKBUN_BASE = "https://api.porkbun.com/api/json/v3";

function domainPath(domain: string): string {
  return encodeURIComponent(domain.trim().toLowerCase());
}

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
  const r = await call<Raw>(`/domain/checkDomain/${domainPath(domain)}`);
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

function usdToPennies(usd: number | undefined): number | null {
  if (!Number.isFinite(usd)) return null;
  return Math.round((usd ?? 0) * 100);
}

function minimumExpiryDate(years = 1): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString();
}

export async function createDomain(args: CreateDomainArgs): Promise<Result<CreateDomainResult>> {
  type Raw = {
    domain?: string;
    expirationDate?: string;
    expireDate?: string;
    orderId?: number | string;
    orderID?: number | string;
  };

  const availability = await checkDomain(args.domain);
  if (!availability.ok) return availability;
  if (!availability.data.available) {
    return { ok: false, code: "DOMAIN_NOT_AVAILABLE", message: "Domain is no longer available" };
  }
  if (availability.data.premium) {
    return { ok: false, code: "PREMIUM_DOMAIN", message: "Premium domains are not supported" };
  }

  const cost = usdToPennies(availability.data.priceUsd);
  if (cost === null) {
    return {
      ok: false,
      code: "MISSING_COST",
      message: "Porkbun did not return a registration price for this domain",
    };
  }

  const r = await call<Raw>(`/domain/create/${domainPath(args.domain)}`, {
    cost,
    agreeToTerms: "yes",
  });
  if (!r.ok) return r;
  return {
    ok: true,
    data: {
      porkbunOrderId: String(r.data.orderId ?? r.data.orderID ?? ""),
      expiresAt: r.data.expirationDate ?? r.data.expireDate ?? minimumExpiryDate(args.years),
    },
  };
}

export async function renewDomain(domain: string, years: number): Promise<Result<RenewDomainResult>> {
  type Raw = { expirationDate?: string; expireDate?: string };
  const pricing = await getPricing();
  if (!pricing.ok) return pricing;

  const tld = domain.split(".").slice(1).join(".");
  const renewalUsd = Number(pricing.data.pricing[tld]?.renewal);
  const cost = usdToPennies(renewalUsd);
  if (cost === null) {
    return {
      ok: false,
      code: "MISSING_COST",
      message: `Porkbun did not return a renewal price for .${tld}`,
    };
  }

  const r = await call<Raw>(`/domain/renew/${domainPath(domain)}`, { cost });
  if (!r.ok) return r;
  return {
    ok: true,
    data: { expiresAt: r.data.expirationDate ?? r.data.expireDate ?? minimumExpiryDate(years) },
  };
}

export async function createOrEditDnsRecord(
  domain: string,
  record: DnsRecord
): Promise<Result<{ id?: string }>> {
  return call<{ id?: string }>(`/dns/createOrEdit/${domainPath(domain)}`, {
    type: record.type,
    name: record.name ?? "",
    content: record.content,
    ttl: String(record.ttl ?? 600),
  });
}
