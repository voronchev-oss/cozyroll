// src/lib/api-guard.ts
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export const AUTH_COOKIE = "cozyroll_auth";
export const CSRF_COOKIE = "cozyroll_csrf";

// Чтение cookie из заголовков (Next 16: headers() -> Promise<ReadonlyHeaders>)
async function getCookie(name: string): Promise<string | null> {
  const h = await headers();
  const raw = h.get("cookie") || "";
  const m = raw.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : null;
}

// Проверка «вошёл ли админ»
export async function requireAdmin() {
  const token = await getCookie(AUTH_COOKIE);
  if (!token || token !== "admin") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

// Сверка CSRF: токен из куки vs токен из формы (hidden input name="csrf")
export async function requireCsrf(formData: FormData) {
  const fromCookie = await getCookie(CSRF_COOKIE);
  const fromForm = String(formData.get("csrf") || "");
  if (!fromCookie || !fromForm || fromCookie !== fromForm) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null;
}

