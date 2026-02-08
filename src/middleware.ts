import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const pathname = req.nextUrl.pathname;

  //  Root route "/"
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    } else {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  //  Protect dashboard routes
  if (pathname.startsWith("/dashboard")) {
    // Not logged in
    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }

    // Role check
    if (token.role !== "owner") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard/:path*"],
};
