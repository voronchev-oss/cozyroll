// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { listProducts, createProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export const runtime = "nodejs";

export async function GET() {
  const items = await listProducts();
  return NextResponse.json({ ok: true, items });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth) return auth;

  const fd = await req.formData();
  const csrfRes = await requireCsrf(fd);
  if (csrfRes) return csrfRes;

  const body = {
    sku: String(fd.get("sku") || ""),
    title: String(fd.get("title") || "Без названия"),
    description: fd.get("description") ? String(fd.get("description")) : null,
    price: Math.round(Number(fd.get("price") || 0)),
    currency: "RUB" as const,
    inStock: !!fd.get("inStock"),
    imageUrl: fd.get("imageUrl") ? String(fd.get("imageUrl")) : null,
    material: fd.get("material") ? String(fd.get("material")) : null,
    color: fd.get("color") ? String(fd.get("color")) : null,
    pileHeight: fd.get("pileHeight") ? Number(fd.get("pileHeight")) : null,
    widthMm: fd.get("widthMm") ? Number(fd.get("widthMm")) : null,
  };

  // newId ВСЕГДА строка (uuid)
  const newId: string = await createProduct(body);

  // Можно редиректить на список или на редактирование. Оставлю на редактирование:
  const url = new URL(`/admin/products/${encodeURIComponent(newId)}/edit`, req.url);
  return NextResponse.redirect(url);
}
