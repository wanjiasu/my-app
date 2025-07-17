import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { usersCurrentUser } from "@/app/clientService";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for public routes
  const publicRoutes = ["/", "/login", "/register", "/password-recovery"];
  if (publicRoutes.includes(pathname) || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }
  
  const token = request.cookies.get("accessToken");

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token.value}`,
    },
  };

  try {
    const { data: user, error } = await usersCurrentUser(options);

    if (error || !user) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Check if the user is trying to access a user-specific route
    const userIdMatch = pathname.match(/^\/([a-f0-9-]{36})/);
    if (userIdMatch) {
      const requestedUserId = userIdMatch[1];
      
      // Only allow access if the user ID matches the current user
      if (user.id !== requestedUserId) {
        // Redirect to their own dashboard
        return NextResponse.redirect(new URL(`/${user.id}/dashboard`, request.url));
      }
    }

    // For /dashboard routes, redirect to user-specific dashboard
    if (pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL(`/${user.id}/dashboard`, request.url));
    }

    // If accessing /{userId} without /dashboard, redirect to dashboard
    if (pathname.match(/^\/[a-f0-9-]{36}$/)) {
      return NextResponse.redirect(new URL(`${pathname}/dashboard`, request.url));
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware error:", err);
    return NextResponse.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|public).*)",
  ],
};
