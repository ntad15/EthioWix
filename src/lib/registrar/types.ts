export type Tld = "com" | "net" | "org" | "xyz";

export const SUPPORTED_TLDS: readonly Tld[] = ["com", "net", "org", "xyz"] as const;

export type Result<T> =
  | { ok: true; data: T }
  | { ok: false; code: string; message: string };

export type RegistrantContact = {
  name: string;
  email: string;
  phone: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};

export type CheckDomainResult = {
  available: boolean;
  premium: boolean;
  priceUsd?: number;
};

export type CreateDomainArgs = {
  domain: string;
  years: number;
  contact: RegistrantContact;
  enableWhoisPrivacy?: boolean;
};

export type CreateDomainResult = {
  porkbunOrderId: string;
  expiresAt: string;
};

export type RenewDomainResult = {
  expiresAt: string;
};

export type DnsRecord = {
  type: "A" | "AAAA" | "CNAME" | "TXT" | "MX";
  name?: string;
  content: string;
  ttl?: number;
};
