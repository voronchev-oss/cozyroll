// middleware.ts
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const CSRF_COOKIE = "cozyroll_csrf";

export function middleware(req: NextRequest) {
  const res = NextResponse.next();

  // Если CSRF-куки нет — устанавливаем один раз
  const has = req.cookies.get(CSRF_COOKIE)?.value;
  if (!has) {
    // Простой токен (достаточно для форм-без-JS)
    const token = crypto.randomUUID();
    res.cookies.set({
      name: CSRF_COOKIE,
      value: token,
      path: "/",
      httpOnly: true,           // не нужен в JS, читаем на сервере из заголовков
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 7 дней
    });
  }
  return res;
}

// Ограничим работу middleware только нужными путями (включая /admin/* и формы)
export const config = {
  matcher: ["/((?!_next|favicon.ico|sitemap.xml|robots.txt).*)"],
};
