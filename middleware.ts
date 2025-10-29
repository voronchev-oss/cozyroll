// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const res = NextResponse.next();

  // Ставим CSRF-cookie при любом GET в админке
  if (pathname.startsWith("/admin") && req.method === "GET") {
    const has = req.cookies.get("cozyroll_csrf");
    if (!has) {
      res.cookies.set("cozyroll_csrf", randomUUID(), {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 дней
      });
    }
  }

  return res;
}

// Работает только на админских страницах
export const config = {
  matcher: ["/admin/:path*"],
};
