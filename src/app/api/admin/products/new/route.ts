// src/app/api/admin/products/new/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createProduct, type Product } from "@/lib/db";

export async function POST(req: Request) {
  const fd = await req.formData();

  const getStr = (key: string) => {
    const v = fd.get(key);
    return typeof v === "string" && v.trim() ? v.trim() : null;
  };

  const getNum = (key: string) => {
    const v = fd.get(key);
    if (typeof v !== "string") return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // Цена в рублях как целое число (у нас price: INTEGER в БД)
  const priceRub = getNum("price") ?? 0;

  const data: Partial<Product> = {
    sku: getStr("sku"),
    title: getStr("title") || "Без названия",
    description: getStr("description"),
    price: priceRub,
    currency: "RUB",
    inStock: !!fd.get("inStock"),
    color: getStr("color"),
    material: getStr("material"),
    // ВАЖНО: имена соответствуют типу Product
    rollWidthMm: getNum("rollWidthMm"),
    pileHeightMm: getNum("pileHeightMm"),
    imageUrl: getStr("imageUrl"),
  };

  const p = await createProduct(data);
  // после создания переходим на редактирование
  return NextResponse.redirect(
    new URL(`/admin/products/${encodeURIComponent(p.id)}/edit`, req.url),
    { status: 303 }
  );
}
