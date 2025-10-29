import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";
export const runtime = "nodejs";

export async function GET() {
  const items = await listProducts();
  return NextResponse.json(items);
}

export async function POST(req: Request) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;

  const fd = await req.formData();
  if (!requireCsrf(req, fd)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const b = {
    sku: String(fd.get("sku") || ""),
    title: String(fd.get("title") || ""),
    description: fd.get("description") ? String(fd.get("description")) : null,
    price: Math.round(Number(fd.get("price") || 0)),
    currency: "RUB",
    inStock: !!fd.get("inStock"),
    widthMm: fd.get("widthMm") != null ? Number(fd.get("widthMm")) : null,
    pileHeight: fd.get("pileHeight") != null ? Number(fd.get("pileHeight")) : null,
    material: fd.get("material") ? String(fd.get("material")) : null,
    color: fd.get("color") ? String(fd.get("color")) : null,
    imageUrl: fd.get("imageUrl") ? String(fd.get("imageUrl")) : null,
  } as const;

  const id = await createProduct(b);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}

