import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = [
  "/sign-in",
  "/sign-up",
  "/auth/callback",
  "/sites/",
  "/api/internal/",
  "/api/webhooks/",
  "/api/cron/",
  "/api/domains/orders/resume",
];

function isPublicPath(pathname: string): boolean {
  if (pathname === "/") return true;
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

const AUTH_DISABLED = process.env.NEXT_PUBLIC_AUTH_DISABLED === "true";

// 60s in-memory cache for custom-domain → slug. v1: no explicit invalidation; worst case
// is 60s of 404 after attaching a new domain. Map persists across requests in a single edge
// instance, so cold-start instances re-fetch.
const CUSTOM_DOMAIN_TTL_MS = 60_000;
const customDomainCache = new Map<string, { slug: string | null; at: number }>();

async function resolveCustomDomain(request: NextRequest, host: string): Promise<string | null> {
  const key = host.toLowerCase();
  const hit = customDomainCache.get(key);
  if (hit && Date.now() - hit.at < CUSTOM_DOMAIN_TTL_MS) return hit.slug;

  try {
    const url = new URL("/api/internal/resolve-domain", request.nextUrl.origin);
    url.searchParams.set("host", key);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      customDomainCache.set(key, { slug: null, at: Date.now() });
      return null;
    }
    const data = (await res.json()) as { slug: string | null };
    customDomainCache.set(key, { slug: data.slug, at: Date.now() });
    return data.slug;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const domain = process.env.DOMAIN ?? "localhost";

  // --- Subdomain routing (always public) ---
  let subdomain: string | null = null;

  if (host.endsWith(`.${domain}`)) {
    subdomain = host.replace(`.${domain}`, "").split(":")[0];
  } else if (domain === "localhost" && host.match(/^(.+)\.localhost/)) {
    subdomain = host.match(/^(.+)\.localhost/)![1].split(":")[0];
  }

  if (subdomain && subdomain !== "www") {
    const url = request.nextUrl.clone();
    url.pathname = `/sites/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
    return NextResponse.rewrite(url);
  }

  // --- Custom domain routing ---
  // Host is not the apex/root domain and not a fetansites subdomain: try Domain table.
  const hostNoPort = host.split(":")[0];
  const isApex = hostNoPort === domain || hostNoPort === `www.${domain}`;
  const isLocal = hostNoPort === "localhost" || hostNoPort.endsWith(".localhost");
  if (!isApex && !isLocal && !subdomain) {
    const slug = await resolveCustomDomain(request, hostNoPort);
    if (slug) {
      const url = request.nextUrl.clone();
      url.pathname = `/sites/${slug}${url.pathname === "/" ? "" : url.pathname}`;
      return NextResponse.rewrite(url);
    }
  }

  // --- Skip auth entirely if disabled ---
  if (AUTH_DISABLED) {
    return NextResponse.next();
  }

  // --- Supabase session refresh ---
  const { user, supabaseResponse } = await updateSession(request);

  // --- Auth protection for main domain ---
  const { pathname } = request.nextUrl;

  if (!user && !isPublicPath(pathname)) {
    const url = request.nextUrl.clone();
    url.pathname = "/sign-in";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
