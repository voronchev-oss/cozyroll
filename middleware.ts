import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // /admin/login доступен без авторизации
  if (pathname.startsWith("/admin/login")) return NextResponse.next();

  // Всё остальное под /admin/* — только с кукой
  const isAuthed = req.cookies.get("cozyroll_auth")?.value === "admin";
  if (pathname.startsWith("/admin") && !isAuthed) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    url.search = ""; // на всякий случай
    return NextResponse.redirect(url, 302);
  }

  return NextResponse.next();
}

// применяем только к /admin/*
export const config = {
  matcher: ["/admin/:path*"],
};
