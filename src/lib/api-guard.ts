// src/lib/api-guard.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export const AUTH_COOKIE_NAME = "cozyroll_auth";
export const CSRF_COOKIE_NAME = "cozyroll_csrf";

export async function verifySession(cookieValue?: string): Promise<boolean> {
  return cookieValue === "admin";
}

function getCookie(name: string, req?: Request): string | undefined {
  const raw = (req?.headers?.get("cookie") || "") as string;
  if (!raw) return undefined;
  const m = raw.match(new RegExp(`${name}=([^;]+)`));
  return m ? decodeURIComponent(m[1]) : undefined;
}

export async function requireAdmin(req?: Request): Promise<Response | null> {
  const cookie = getCookie(AUTH_COOKIE_NAME, req);
  if (!cookie) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  const ok = await verifySession(cookie);
  if (!ok) return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  return null;
}

export function pickCsrfFromHeaders(h: Headers | Readonly<Headers> | any): string {
  const raw = typeof h?.get === "function" ? h.get("cookie") || "" : "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export async function requireCsrf(
  reqOrFd: Request | FormData,
  reqIfFd?: Request
): Promise<Response | null> {
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
  return null;
}
