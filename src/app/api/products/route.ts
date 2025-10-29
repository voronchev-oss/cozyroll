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
  const csrf = await requireCsrf(fd);
  if (csrf) return csrf;

  const body = {
    sku: String(fd.get("sku") || ""),
    title: String(fd.get("title") || "Без названия"),
    description: fd.get("description") ? String(fd.get("description")) : null,
    price: Math.round(Number(fd.get("price") || 0)),
    currency: "RUB",
    inStock: !!fd.get("inStock"),
  };

  const id = await createProduct(body);
  return NextResponse.redirect(new URL(`/admin/products/${id}/edit`, req.url));
}

