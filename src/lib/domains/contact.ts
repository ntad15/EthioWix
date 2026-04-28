import type { RegistrantContact } from "@/lib/registrar/types";

// FetanSites is the legal registrant of record for all REGISTERED domains.
// Beneficial-owner contact is stored separately on the Domain row (for future transfer-out).
export function getRegistrantContact(): RegistrantContact {
  const get = (k: string, fallback?: string) => {
    const v = process.env[k];
    if (!v && fallback === undefined) {
      throw new Error(`Missing env var: ${k}`);
    }
    return v ?? fallback!;
  };
  return {
    name: get("REGISTRANT_NAME", "FetanSites"),
    email: get("REGISTRANT_EMAIL"),
    phone: get("REGISTRANT_PHONE"),
    address1: get("REGISTRANT_ADDRESS1", "Addis Ababa"),
    city: get("REGISTRANT_CITY", "Addis Ababa"),
    state: get("REGISTRANT_STATE", "AA"),
    postalCode: get("REGISTRANT_POSTAL_CODE", "1000"),
    country: get("REGISTRANT_COUNTRY", "ET"),
  };
}
