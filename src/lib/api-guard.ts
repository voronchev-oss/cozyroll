// src/lib/api-guard.ts
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

/** Имена куки */
export const AUTH_COOKIE_NAME = "cozyroll_auth"; // значение "admin" = вошёл
export const CSRF_COOKIE_NAME = "cozyroll_csrf";

/** Проверка админской "сессии" (простой режим через куку cozyroll_auth=admin) */
export async function requireAdmin(): Promise<Response | null> {
  const c = await cookies();
  const val = c.get(AUTH_COOKIE_NAME)?.value;
  if (val !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

/** Достаём CSRF-токен из заголовков (cookie) — удобно в серверных компонентах/страницах */
export function pickCsrfFromHeaders(h: { get(name: string): string | null }): string {
  const raw = h.get("cookie") || "";
  const m = raw.match(/(?:^|;\s*)cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/** Проверяем CSRF в POST: сравниваем hidden field "csrf" с cookie cozyroll_csrf */
export async function requireCsrf(formData: FormData): Promise<Response | null> {
  const c = await cookies();
  const cookieToken = c.get(CSRF_COOKIE_NAME)?.value || "";

  // Токен из формы
  const bodyToken = String(formData.get("csrf") || "");

  if (!cookieToken || !bodyToken || cookieToken !== bodyToken) {
    return NextResponse.json({ error: "csrf_invalid" }, { status: 403 });
  }
  return null;
}
