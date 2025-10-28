// src/app/api/auth/logout/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const res = NextResponse.redirect(new URL("/", req.url));
  res.headers.append(
    "Set-Cookie",
    ["cozyroll_auth=;", "Path=/", "HttpOnly", "SameSite=Lax", "Max-Age=0", process.env.NODE_ENV === "production" ? "Secure" : ""]
      .filter(Boolean)
      .join("; ")
  );
  return res;
}
