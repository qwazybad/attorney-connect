import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/compare(.*)",
  "/attorney(.*)",
  "/join(.*)",
  "/pitch(.*)",
  "/for-attorneys(.*)",
  "/api/attorneys(.*)",
  "/api/leads(.*)",
]);

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const maintenance = process.env.MAINTENANCE_MODE === "true";
  const pathname = req.nextUrl.pathname;

  // Allow admin, portal, api, and the maintenance page itself through always
  const exempt =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/attorney-portal") ||
    pathname.startsWith("/api/") ||
    pathname.startsWith("/maintenance") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/icon") ||
    pathname.startsWith("/opengraph");

  if (maintenance && !exempt) {
    return NextResponse.redirect(new URL("/maintenance", req.url));
  }
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
