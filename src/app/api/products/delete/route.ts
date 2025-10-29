// src/app/api/products/delete/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const csrfRes = await requireCsrf(req);
  if (csrfRes) return csrfRes;

  const fd = await req.formData();
  const id = String(fd.get("id") || "");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  await deleteProduct(id);
  return NextResponse.redirect(new URL("/admin/products", req.url), 303);
}
