import { getSiteById } from "@/lib/db/site-store";

const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

export type SiteAccessResult =
  | { ok: true; siteId: string }
  | { ok: false; status: 404 | 403; error: string };

export async function assertOwnedSite(
  siteId: string | null | undefined,
  userId: string
): Promise<SiteAccessResult> {
  if (!siteId) return { ok: true, siteId: "" };

  const site = AUTH_DISABLED
    ? await (await import("@/lib/db/local-store")).getSiteById(siteId)
    : await getSiteById(siteId);
  if (!site) return { ok: false, status: 404, error: "Site not found" };
  if (site.userId !== userId) return { ok: false, status: 403, error: "Forbidden" };

  return { ok: true, siteId: site.id };
}
