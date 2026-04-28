import type { Tld } from "@/lib/registrar/types";

// Flat birr price per TLD. Re-evaluated quarterly. FetanSites absorbs FX risk.
// Price targets renewal cost (not promotional first-year), since every domain renews.
// Last reviewed: 2026-04-28.
export const BIRR_PRICING: Record<Tld, number> = {
  com: 1800,
  net: 2200,
  org: 2000,
  xyz: 1700,
};

export function getPriceBirr(tld: Tld): number {
  return BIRR_PRICING[tld];
}
