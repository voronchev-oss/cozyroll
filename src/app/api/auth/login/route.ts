// src/app/api/auth/login/route.ts
export const runtime = "nodejs"; // важно для корректной установки HttpOnly-куки в проде

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const fd = await req.formData();
  const email = String(fd.get("email") || "").toLowerCase().trim();
  const pass = String(fd.get("password") || "");

  const ok =
    email === String(process.env.ADMIN_EMAIL || "").toLowerCase().trim() &&
    pass === String(process.env.ADMIN_PASSWORD || "");

  if (!ok) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  const res = NextResponse.redirect(new URL("/admin/products", req.url));
  res.headers.append(
    "Set-Cookie",
    [
      "cozyroll_auth=admin",
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      `Max-Age=${60 * 60 * 24 * 7}`, // 7 дней
      process.env.NODE_ENV === "production" ? "Secure" : "",
    ]
      .filter(Boolean)
      .join("; ")
  );
  return res;
}
