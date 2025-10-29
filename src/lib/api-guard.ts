// src/lib/api-guard.ts
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySession } from "@/lib/auth";

// читаем cookie <name> из заголовка
function getCookieFromHeader(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") || "";
  const m = raw.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

/** Требуем валидную админ-сессию.
 * Поддерживаем ДВА режима:
 * 1) "cozyroll_auth=admin" (упрощённый логин)
 * 2) JWT в куке AUTH_COOKIE_NAME (из @/lib/auth)
 */
export async function requireAdmin(req: Request): Promise<Response | null> {
  // имя куки: берём из ENV, иначе legacy-имя
  const name = process.env.AUTH_COOKIE_NAME || "cozyroll_auth";
  const token = getCookieFromHeader(req, name);
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // режим 1: простая кука cozyroll_auth=admin
  if (name === "cozyroll_auth" && token === "admin") {
    return null;
  }

  // режим 2: JWT (современный)
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return null;
}

/** CSRF: hidden input "csrf" должен совпасть с cookie cozyroll_csrf */
export function requireCsrf(req: Request, fd: FormData): boolean {
  const bodyToken = String(fd.get("csrf") || "");
  const cookieToken = getCookieFromHeader(req, "cozyroll_csrf") || "";
  return !!bodyToken && !!cookieToken && bodyToken === cookieToken;
}

