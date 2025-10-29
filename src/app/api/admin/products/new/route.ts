// src/app/api/admin/products/new/route.ts
import { NextResponse } from "next/server";
import { createProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // 1) Авторизация админа
  const auth = await requireAdmin();
  if (auth) return auth;

  // 2) Тело формы + CSRF
  const fd = await req.formData();
  const csrfRes = await requireCsrf(fd);
  if (csrfRes) return csrfRes;

  // Утилиты для чтения полей
  const getStr = (k: string) => {
    const v = fd.get(k);
    const s = v == null ? "" : String(v).trim();
    return s.length ? s : null;
  };
  const getNum = (k: string) => {
    const v = fd.get(k);
    if (v == null) return null;
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  };

  // 3) Сопоставление полей формы -> Product
  //    ВАЖНО: используем имена из типа Product (widthMm, pileHeight).
  //    На всякий случай поддерживаем и старые названия (rollWidthMm, pileHeightMm).
  const body = {
    sku: getStr("sku"),
    title: String(fd.get("title") || "Без названия"),
    description: getStr("description"),
    price: Math.round(Number(fd.get("price") || 0)),
    currency: "RUB" as const,
    inStock: !!fd.get("inStock"),
    imageUrl: getStr("imageUrl"),
    material: getStr("material"),
    color: getStr("color"),
    widthMm: getNum("widthMm") ?? getNum("rollWidthMm"),
    pileHeight: getNum("pileHeight") ?? getNum("pileHeightMm"),
  };

  // 4) Создание и редирект на редактирование
  const id = await createProduct(body); // ← строка UUID
  return NextResponse.redirect(
    new URL(`/admin/products/${encodeURIComponent(id)}/edit`, req.url)
  );
}
