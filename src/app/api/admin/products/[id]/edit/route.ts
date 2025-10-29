export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { updateProduct } from "@/lib/db";
import { requireAdmin } from "@/lib/api-guard";

type Params = { params: { id: string } };

export async function POST(req: Request, { params }: Params) {
  // защита
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const fd = await req.formData();

  const data = {
    title: String(fd.get("title") || "Без названия"),
    sku: fd.get("sku") ? String(fd.get("sku")) : null,
    price: Number(fd.get("price") || 0),
    inStock: !!fd.get("inStock"),
    imageUrl: fd.get("imageUrl") ? String(fd.get("imageUrl")) : null,
  };

  await updateProduct(params.id, data);

  // после сохранения вернёмся в список
  return NextResponse.redirect(new URL("/admin/products", req.url), { status: 303 });
}
