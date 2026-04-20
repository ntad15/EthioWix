import { NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const PUBLIC_PATHS = ["/sign-in", "/sign-up", "/auth/callback", "/sites/"];

function isPublicPath(pathname: string): boolean {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
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
