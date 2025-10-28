// src/lib/api-guard.ts
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySession } from "@/lib/auth";

// достаём cookie из заголовка (синхронно, без await cookies())
function getCookieFromHeader(req: Request, name: string): string | null {
  const raw = req.headers.get("cookie") || "";
  const parts = raw.split(/;\s*/);
  for (const p of parts) {
    const [k, ...rest] = p.split("=");
    if (!k) continue;
    if (k === name) return decodeURIComponent(rest.join("=") || "");
  }
  return null;
}

/**
 * Требует валидную админ-сессию (JWT в куке).
 * Если нет — вернёт JSON 401 (Response).
 * Если всё ок — вернёт null.
 */
export async function requireAdmin(req: Request): Promise<Response | null> {
  const token = getCookieFromHeader(req, AUTH_COOKIE_NAME || "__Host-cozyroll_sess");
  if (!token) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null; // ✅ корректный возврат
}

/** Защита от CSRF: сравниваем токен в теле (hidden input name="csrf") с токеном в cookie */
export function requireCsrf(req: Request, fd: FormData): boolean {
  const csrfBody = String(fd.get("csrf") || "");
  const csrfCookie = getCookieFromHeader(req, "cozyroll_csrf") || "";
  return csrfBody.length > 0 && csrfCookie.length > 0 && csrfBody === csrfCookie;
}

