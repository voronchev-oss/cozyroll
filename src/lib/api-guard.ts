// src/lib/api-guard.ts
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, verifySession } from "./session";

export async function requireAdmin(_req: Request) {
  // ВАЖНО: cookies() теперь async → нужен await
  const jar = await cookies();
  const cookie = jar.get(AUTH_COOKIE_NAME)?.value;

  if (!cookie) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const session = await verifySession(cookie);
  if (!session) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // всё ок — вернём null, чтобы вызывающий код продолжил работу
  return null as const;
}
