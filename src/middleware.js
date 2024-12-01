import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export const TOKEN_KEY = "token";

export async function middleware(request) {
  const cookie = await cookies();
  const token = cookie.get(TOKEN_KEY);

  const protectedRoutes = ["/", "/adm", "/cadastro"];

  const isHomePage = request.nextUrl.pathname === "/";

  if (isHomePage && token) {
    return NextResponse.redirect(new URL("/adm", request.url));
  }

  const isProtectedRoute = protectedRoutes.includes(request.nextUrl.pathname);

  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/adm/:path*", "/cadastro/:path*"],
};
