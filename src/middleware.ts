// src/middleware.ts - Updated to include new routes
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/error",
    "/graduate/search",
    "/graduate/register",
    "/api/auth/callback",
    "/api/auth/signin",
    "/api/auth/signout",
    "/api/graduate/search", // Allow public access to graduate search
  ];

  // Check if the current route is public
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route)
  );

  // If it's a public route, allow access
  if (isPublicRoute) {
    return NextResponse.next();
  }

  // If user is not authenticated, redirect to login
  if (!session) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If user is deactivated, deny access
  if (session.user.isDeactivated) {
    return NextResponse.redirect(
      new URL("/auth/login?error=deactivated", request.url)
    );
  }

  // Handle account activation flow
  if (session.user.accountStatus === "pending_activation") {
    // Only allow access to activation page and logout
    if (
      !pathname.startsWith("/auth/activate-account") &&
      !pathname.startsWith("/api/auth")
    ) {
      return NextResponse.redirect(
        new URL("/auth/activate-account", request.url)
      );
    }
    return NextResponse.next();
  }

  // Role-based route protection
  const userType = session.user.type;

  // Define role-based route access
  const roleRoutes = {
    VGSS_OFFICE: ["/dashboard/vgss-office"],
    BLW_ZONE: ["/dashboard/blw-zone"],
    MINISTRY_OFFICE: ["/dashboard/ministry-office"],
    GRADUATE: ["/dashboard/graduate"],
  };

  // Check if user is accessing a dashboard
  if (pathname.startsWith("/dashboard/")) {
    const allowedRoutes = roleRoutes[userType as keyof typeof roleRoutes] || [];
    const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));

    if (!hasAccess) {
      // Redirect to user's appropriate dashboard
      switch (userType) {
        case "VGSS_OFFICE":
          return NextResponse.redirect(
            new URL("/dashboard/vgss-office", request.url)
          );
        case "BLW_ZONE":
          return NextResponse.redirect(
            new URL("/dashboard/blw-zone", request.url)
          );
        case "MINISTRY_OFFICE":
          return NextResponse.redirect(
            new URL("/dashboard/ministry-office", request.url)
          );
        case "GRADUATE":
          return NextResponse.redirect(
            new URL("/dashboard/graduate", request.url)
          );
        default:
          return NextResponse.redirect(new URL("/auth/login", request.url));
      }
    }
  }

  // API route protection
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/")) {
    // Protected API routes that require authentication
    const protectedApiRoutes = [
      "/api/admin/",
      "/api/zone/",
      "/api/graduate/register",
    ];

    const isProtectedApi = protectedApiRoutes.some((route) =>
      pathname.startsWith(route)
    );

    if (isProtectedApi) {
      // Additional role-based API protection
      if (pathname.startsWith("/api/admin/") && userType !== "VGSS_OFFICE") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      if (pathname.startsWith("/api/zone/") && userType !== "BLW_ZONE") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
