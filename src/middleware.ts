import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  const domain = process.env.DOMAIN ?? "localhost";

  // Extract subdomain: "azure.ethiowix.com" → "azure"
  // Also handles "azure.localhost" for local testing
  let subdomain: string | null = null;

  if (host.endsWith(`.${domain}`)) {
    subdomain = host.replace(`.${domain}`, "").split(":")[0];
  } else if (domain === "localhost" && host.match(/^(.+)\.localhost/)) {
    subdomain = host.match(/^(.+)\.localhost/)![1].split(":")[0];
  }

  // Skip if no subdomain, or if it's "www"
  if (!subdomain || subdomain === "www") {
    return NextResponse.next();
  }

  // Rewrite subdomain requests to /sites/{slug}
  const url = request.nextUrl.clone();
  url.pathname = `/sites/${subdomain}${url.pathname === "/" ? "" : url.pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Run on all paths except static assets and API routes from the main domain
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
