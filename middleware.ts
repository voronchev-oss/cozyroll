// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export const config = {
  matcher: [
    "/admin/:path*", // защищаем всё под /admin
  ],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Страницу логина не защищаем
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  const cookie = req.cookies.get("cozyroll_auth")?.value;

  if (cookie === "admin") {
    return NextResponse.next();
  }

  // не залогинен → на /admin/login
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}
