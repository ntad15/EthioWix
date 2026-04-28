import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { isValidLabel, normalizeDomain, splitDomain } from "@/lib/domains/validation";
import { SUPPORTED_TLDS, type Tld } from "@/lib/registrar/types";
import { checkDomain } from "@/lib/registrar/porkbun";
import { getPriceBirr } from "@/lib/domains/pricing";

type SearchHit = {
  name: string;
  tld: Tld;
  available: boolean;
  premium: boolean;
  priceBirr: number;
};

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as { query?: string };
  const raw = (body.query ?? "").toString();
  if (!raw) return NextResponse.json({ error: "Missing query" }, { status: 400 });

  const normalized = normalizeDomain(raw);
  const split = splitDomain(normalized);
  const label = split ? split.label : normalized;

  if (!isValidLabel(label)) {
    return NextResponse.json({ error: "Invalid domain label" }, { status: 400 });
  }

  const results = await Promise.all(
    SUPPORTED_TLDS.map(async (tld): Promise<SearchHit | null> => {
      const name = `${label}.${tld}`;
      const r = await checkDomain(name);
      if (!r.ok) return null;
      return {
        name,
        tld,
        available: r.data.available,
        premium: r.data.premium,
        priceBirr: getPriceBirr(tld),
      };
    })
  );

  return NextResponse.json({ results: results.filter((x): x is SearchHit => x !== null) });
}
