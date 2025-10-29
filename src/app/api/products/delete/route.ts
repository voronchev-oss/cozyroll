import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const fd = await req.formData();
  const csrf = await requireCsrf(fd);
  if (csrf) return csrf;

  const id = String(fd.get("id") || "");
  if (!id) return NextResponse.json({ error: "no id" }, { status: 400 });

  await deleteProduct(id);
  return NextResponse.redirect(new URL("/admin/products", req.url));
}

