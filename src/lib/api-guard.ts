// src/lib/api-guard.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

/** Имя cookie с сессией админа (ставится в /api/auth/login) */
export const AUTH_COOKIE_NAME = "cozyroll_auth";
/** Имя cookie с CSRF-токеном (ставится в middleware) */
export const CSRF_COOKIE_NAME = "cozyroll_csrf";

/** Простейшая проверка «сессии админа». В логине кладём строку 'admin' — её и ждём. */
export async function verifySession(cookieValue?: string): Promise<boolean> {
  return cookieValue === "admin";
}

/** Достаём строку cookie по имени из Request (или из заголовков, если Request не передали) */
function getCookie(name: string, req?: Request): string | undefined {
  const raw = (req?.headers?.get("cookie") || "") as string;
  if (!raw) return undefined;
  const m = raw.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

/**
 * Охрана админ-маршрутов.
 * Параметр request ДЕЛАЕМ НЕОБЯЗАТЕЛЬНЫМ — тогда код будет компилироваться и
 * с вызовами requireAdmin() и с requireAdmin(req).
 */
export async function requireAdmin(req?: Request) {
  const cookie = getCookie(AUTH_COOKIE_NAME, req);
  if (!cookie) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const ok = await verifySession(cookie);
  if (!ok) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null as const;
}

/** Достаём CSRF-токен из заголовков (cookie) — для серверных страниц */
export function pickCsrfFromHeaders(
  h: Headers | Readonly<Headers> | ReadonlyHeaders | any
): string {
  const raw = typeof h?.get === "function" ? h.get("cookie") || "" : "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

/**
 * ВАЛИДАЦИЯ CSRF.
 * Можно передать либо Request (тогда сами прочитаем formData и cookie),
 * либо уже готовый FormData (тогда cookie возьмём из второго аргумента Request).
 */
export async function requireCsrf(reqOrFd: Request | FormData, reqIfFd?: Request) {
  let fd: FormData;
  let req: Request | undefined;

  if (typeof (reqOrFd as any).formData === "function") {
    req = reqOrFd as Request;
    fd = await req.formData();
  } else {
    fd = reqOrFd as FormData;
    req = reqIfFd;
  }

  const tokenFromForm = String(fd.get("csrf") || "");
  const tokenFromCookie = getCookie(CSRF_COOKIE_NAME, req) || "";

  if (!tokenFromForm || !tokenFromCookie || tokenFromForm !== tokenFromCookie) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  return null as const;
}
