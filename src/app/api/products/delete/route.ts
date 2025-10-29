// src/app/api/products/delete/route.ts
import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const fd = await req.formData();
  const csrfRes = await requireCsrf(fd);
  if (csrfRes) return csrfRes;

  const id = String(fd.get("id") || "").trim();
  if (!id) return NextResponse.json({ error: "no id" }, { status: 400 });

  await deleteProduct(id);

  return NextResponse.redirect(new URL("/admin/products", req.url));
}
