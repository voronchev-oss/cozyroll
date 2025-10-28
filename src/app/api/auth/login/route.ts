import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const fd = await req.formData();
  const email = String(fd.get("email") || "").toLowerCase().trim();
  const pass  = String(fd.get("password") || "");

  const ok =
    email === (process.env.ADMIN_EMAIL || "").toLowerCase() &&
    pass  === (process.env.ADMIN_PASSWORD || "");

  if (!ok) {
    return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  }

  // ВАЖНО: 303, чтобы превратить POST в GET
  const res = NextResponse.redirect(new URL("/admin/products", req.url), { status: 303 });

  // Кука авторизации (7 дней)
  res.headers.append(
    "Set-Cookie",
    `cozyroll_auth=admin; HttpOnly; Path=/; Max-Age=${60 * 60 * 24 * 7}; SameSite=Lax; ${
      process.env.NODE_ENV === "production" ? "Secure; " : ""
    }`
  );

  return res;
}
