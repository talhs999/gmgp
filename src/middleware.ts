import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method;

  // ── Block debug-admin route in production ─────────────────────────
  if (pathname.startsWith("/api/debug-admin")) {
    if (process.env.NODE_ENV === "production") {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
  }

  // ── CSRF: block cross-origin mutating API requests ─────────────────
  // Note: this protects API routes from requests originating from other domains.
  // Supabase handles auth via localStorage (not cookies) so we keep session
  // checks on the client side (admin/layout.tsx) to avoid false redirects.
  if (
    ["POST", "PUT", "PATCH", "DELETE"].includes(method) &&
    pathname.startsWith("/api/")
  ) {
    const origin = request.headers.get("origin");
    const host = request.headers.get("host");

    // If origin header present and doesn't match our host → block
    if (origin && host) {
      const originHost = new URL(origin).hostname;
      const serverHost = host.split(":")[0]; // strip port
      if (originHost !== serverHost) {
        return NextResponse.json(
          { error: "CSRF: Cross-origin request blocked" },
          { status: 403 }
        );
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on API routes (for CSRF check) and debug-admin (for prod block)
    "/api/:path*",
  ],
};
