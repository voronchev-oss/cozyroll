// src/lib/api-guard.ts
import { cookies, headers } from "next/headers";
import { NextResponse } from "next/server";

// Куки для авторизации и CSRF
export const AUTH_COOKIE_NAME = "cozyroll_auth";   // значение "admin" = авторизован
export const CSRF_COOKIE_NAME = "cozyroll_csrf";

// Простейшая проверка "сессии" администратора
export async function requireAdmin() {
  const c = await cookies();
  const val = c.get(AUTH_COOKIE_NAME)?.value;
  if (val !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null as const;
}

/** Достаём CSRF-токен из заголовков (cookie) — для серверных компонент/страниц */
export function pickCsrfFromHeaders(h: Readonly<Headers> | Headers): string {
  const raw = h.get("cookie") || "";
  const m = raw.match(/(?:^|;\s*)cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/** Проверяем CSRF в POST: сравниваем hidden field "csrf" c значением в cookie */
export async function requireCsrf(formData: FormData) {
  // cookie можно взять либо так…
  const c = await cookies();
  const cookieToken = c.get(CSRF_COOKIE_NAME)?.value || "";
  // …либо из заголовков:
  if (!cookieToken) {
    const h = await headers();
    const hdrToken = pickCsrfFromHeaders(h);
    if (!hdrToken) {
      return NextResponse.json({ error: "csrf_missed" }, { status: 403 });
    }
  }

  const bodyToken = String(formData.get("csrf") || "");
  if (!bodyToken || bodyToken !== (c.get(CSRF_COOKIE_NAME)?.value || "")) {
    return NextResponse.json({ error: "csrf_invalid" }, { status: 403 });
  }
  return null as const;
}

