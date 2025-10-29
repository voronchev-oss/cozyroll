// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { createProduct, updateProduct, listProducts } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export const runtime = "nodejs";

// Список товаров
export async function GET() {
  const items = await listProducts();
  return NextResponse.json({ ok: true, items });
}

// Создание ИЛИ обновление товара одной формой.
// Если пришёл hidden input name="id" → UPDATE, иначе CREATE.
export async function POST(req: Request) {
  // 1) охрана
  const guard = await requireAdmin(); // <— без аргументов
  if (guard) return guard;

  const csrfCheck = await requireCsrf(req); // <— здесь аргумент нужен
  if (csrfCheck) return csrfCheck;

  // 2) читаем форму
  const fd = await req.formData();

  const getStr = (k: string) => {
    const v = fd.get(k);
    return v != null && String(v).trim() !== "" ? String(v).trim() : null;
  };
  const getNum = (k: string) => {
    const v = fd.get(k);
    if (v == null || String(v).trim() === "") return null;
    const n = Number(String(v).replace(/\s/g, "").replace(",", "."));
    return Number.isFinite(n) ? n : null;
  };

  // цена в копейках
  const priceRub = getNum("price");
  const priceCents = priceRub != null ? Math.round(priceRub) * 100 : 0;

  const payload = {
    sku: getStr("sku"),
    title: getStr("title") || "Без названия",
    description: getStr("description"),
    price: priceCents,
    inStock: fd.get("inStock") ? true : false,
    imageUrl: getStr("imageUrl"),
    material: getStr("material"),
    color: getStr("color"),
    pileHeight: getNum("pileHeight"),
    widthMm: getNum("widthMm"),
  };

  const id = getStr("id");

  if (id) {
    await updateProduct(id, payload);
    return NextResponse.redirect(new URL(`/admin/products/${id}/edit`, req.url), 303);
  } else {
    const newId = await createProduct(payload);
    return NextResponse.redirect(new URL(`/admin/products/${newId}/edit`, req.url), 303);
  }
}
