import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(request: NextRequest) {
    const token = await getToken({ req: request });
    const { pathname } = request.nextUrl;

    // 1. Check and Normalize Role (Handles ADMIN, admin, USER, user, etc.)
    const userRole = (token?.role as string)?.toUpperCase(); 
    
    // const isAdmin = userRole === "ADMIN";
    // const isUser = userRole === "USER";
    // const isGuest = !token;

    console.log("-----------------------------------------");
    console.log(`[Proxy] Request: ${pathname}`);
    // console.log(`[Proxy] User State: ${isGuest ? "Guest" : userRole}`);

    // 2. Rule: Guests cannot see the Dashboard
    // if (isGuest && pathname.startsWith("/dashboard")) {
    //     console.log("Action: Guest tried to enter Dashboard -> Redirect to Login");
    //     return NextResponse.redirect(new URL("/auth/login", request.url));
    // }

    // 3. Rule: Regular Users cannot see the Dashboard
    // if (isUser && pathname.startsWith("/dashboard")) {
    //     console.log("Action: Regular User tried to enter Dashboard -> Redirect to Home");
    //     return NextResponse.redirect(new URL("/", request.url));
    // }

    // 4. Rule: Admins shouldn't be stuck on the Landing Page
    // if (isAdmin && pathname === "/") {
    //     console.log("Action: Admin on Home -> Redirect to Dashboard");
    //     return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    // Allow everything else (e.g., Users on Home, Admins on Dashboard)
    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|assets|favicon.ico|sitemap.xml|robots.txt).*)",
    ],
};