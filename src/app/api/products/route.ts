import { NextResponse } from "next/server";
import { createProduct, listProducts } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";
export const runtime = "nodejs";

export async function GET() {
  const list = await listProducts();
  return NextResponse.json(list);
}

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const fd = await req.formData();
  if (!requireCsrf(req, fd)) {
    return NextResponse.json({ error: "bad csrf" }, { status: 403 });
  }

  const data = {
    sku: String(fd.get("sku") || "") || null,
    title: String(fd.get("title") || "Без названия"),
    description: fd.get("description") ? String(fd.get("description")) : null,
    price: Math.round(Number(fd.get("price") || 0)),
    in_stock: !!fd.get("inStock"),
    width_mm: fd.get("widthMm") ? Number(fd.get("widthMm")) : null,
    pile_height: fd.get("pileHeight") ? Number(fd.get("pileHeight")) : null,
    material: fd.get("material") ? String(fd.get("material")) : null,
    color: fd.get("color") ? String(fd.get("color")) : null,
    image_url: fd.get("imageUrl") ? String(fd.get("imageUrl")) : null,
  };

  const created = await createProduct(data);
  return NextResponse.json(created, { status: 201 });
}
