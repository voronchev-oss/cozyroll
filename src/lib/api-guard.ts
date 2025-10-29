// src/lib/api-guard.ts
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySession } from "@/lib/auth";

// читаем конкретную cookie из заголовка
function getCookieFromHeader(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") || "";
  const m = raw.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/** Требуем валидную админ-сессию (JWT в куке). */
export async function requireAdmin(req: Request): Promise<Response | null> {
  const name = AUTH_COOKIE_NAME || "cozyroll_auth"; // ДОЛЖЕН совпадать с login-роутом
  const token = getCookieFromHeader(req, name);
  if (!token) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const session = await verifySession(token);
  if (!session) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  return null;
}

/** Проверяем CSRF: hidden input "csrf" должен совпадать с cookie cozyroll_csrf */
export function requireCsrf(req: Request, fd: FormData): boolean {
  const bodyToken = String(fd.get("csrf") || "");
  const cookieToken = getCookieFromHeader(req, "cozyroll_csrf") || "";
  return !!bodyToken && !!cookieToken && bodyToken === cookieToken;
}

