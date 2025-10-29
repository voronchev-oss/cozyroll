// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // На любой GET к /admin/* ставим CSRF-куку, если её нет
  if (req.nextUrl.pathname.startsWith("/admin") && req.method === "GET") {
    if (!req.cookies.get("cozyroll_csrf")) {
      const token =
        globalThis.crypto?.randomUUID?.() ??
        Math.random().toString(36).slice(2); // запасной вариант
      res.cookies.set("cozyroll_csrf", token, {
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

// Middleware должен лежать в корне и матчить админку
export const config = {
  matcher: ["/admin/:path*"],
};
