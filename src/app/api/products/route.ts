// src/app/api/products/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import {
  listProducts,
  createProduct,
  type Product,
} from "@/lib/db";

// ===== helpers =====
function getStr(fd: FormData, key: string) {
  const v = fd.get(key);
  return typeof v === "string" && v.trim() ? v.trim() : null;
}
function getNum(fd: FormData, key: string) {
  const v = fd.get(key);
  if (typeof v !== "string") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

// GET /api/products?q=&color=&material=&inStock=1
export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") || undefined;
  const color = url.searchParams.get("color") || undefined;
  const material = url.searchParams.get("material") || undefined;
  const inStockParam = url.searchParams.get("inStock");
  const inStock =
    inStockParam === null ? undefined : inStockParam === "1" || inStockParam === "true";

  const items = await listProducts({ q, color, material, inStock });
  return NextResponse.json({ ok: true, items });
}

// POST /api/products  (FormData)
export async function POST(req: Request) {
  const fd = await req.formData();

  // Цена хранится как целое число (копейки/рубли), у нас колонка INTEGER
  const priceRub = getNum(fd, "price") ?? 0;

  const data: Partial<Product> = {
    sku: getStr(fd, "sku"),
    title: getStr(fd, "title") || "Без названия",
    description: getStr(fd, "description"),
    price: priceRub,
    currency: "RUB",
    inStock: !!fd.get("inStock"),
    color: getStr(fd, "color"),
    material: getStr(fd, "material"),
    // ВАЖНО: корректные имена полей из типа Product
    rollWidthMm: getNum(fd, "rollWidthMm"),
    pileHeightMm: getNum(fd, "pileHeightMm"),
    imageUrl: getStr(fd, "imageUrl"),
  };

  const p = await createProduct(data);
  return NextResponse.json({ ok: true, id: p.id }, { status: 201 });
}
