import { NextRequest, NextResponse } from "next/server";
import { getAuthUserId } from "@/lib/domains/auth";
import { normalizeDomain, splitDomain } from "@/lib/domains/validation";
import { assertOwnedSite } from "@/lib/domains/sites";
import { createDomain, getDomainByName, updateDomain } from "@/lib/db/domain-store";

type Body = { domainName: string; siteId?: string };

export async function POST(request: NextRequest) {
  const userId = await getAuthUserId();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json().catch(() => ({}))) as Partial<Body>;
  if (!body.domainName) {
    return NextResponse.json({ error: "Missing domainName" }, { status: 400 });
  }

  const name = normalizeDomain(body.domainName);
  const split = splitDomain(name);
  if (!split) return NextResponse.json({ error: "Invalid domain" }, { status: 400 });

  const siteAccess = await assertOwnedSite(body.siteId, userId);
  if (!siteAccess.ok) {
    return NextResponse.json({ error: siteAccess.error }, { status: siteAccess.status });
  }
  const siteId = siteAccess.siteId || null;

  const edgeIp = process.env.FETANSITES_EDGE_IP;
  if (!edgeIp) {
    return NextResponse.json({ error: "Edge IP not configured" }, { status: 500 });
  }

  const existing = await getDomainByName(name);
  if (existing && existing.userId !== userId) {
    return NextResponse.json({ error: "Domain already attached" }, { status: 409 });
  }

  const domain = existing
    ? await updateDomain(existing.id, {
        siteId: siteId ?? existing.siteId,
        status: "PENDING",
      })
    : await createDomain({
        name,
        tld: split.tld,
        siteId,
        userId,
        source: "EXTERNAL",
        status: "PENDING",
      });

  return NextResponse.json({
    id: domain.id,
    name: domain.name,
    instructions: {
      apexA: { type: "A", name: "@", value: edgeIp },
      wwwCname: { type: "CNAME", name: "www", value: name },
      note: "DNS changes can take up to 24 hours to propagate. Click Verify after updating your records.",
    },
  });
}
