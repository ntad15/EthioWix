import { SUPPORTED_TLDS, type Tld } from "@/lib/registrar/types";

const LABEL_RE = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?$/;

export function normalizeDomain(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^www\./, "");
}

export function isValidLabel(label: string): boolean {
  return LABEL_RE.test(label);
}

export function splitDomain(full: string): { label: string; tld: string } | null {
  const parts = full.split(".");
  if (parts.length < 2) return null;
  const tld = parts.slice(1).join(".");
  const label = parts[0];
  return { label, tld };
}

export function isSupportedTld(tld: string): tld is Tld {
  return (SUPPORTED_TLDS as readonly string[]).includes(tld);
}
