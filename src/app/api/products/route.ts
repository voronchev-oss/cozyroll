// src/app/api/products/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { createProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const csrfRes = await requireCsrf(req);
  if (csrfRes) return csrfRes;

  const fd = await req.formData();
  const getStr = (k: string) => {
    const v = fd.get(k);
    return v != null && String(v).trim() !== "" ? String(v) : null;
    };
  const getNum = (k: string) => {
    const v = fd.get(k);
    return v != null && String(v).trim() !== "" ? Math.round(Number(v)) : null;
  };

  const id = await createProduct({
    title: getStr("title") ?? "Без названия",
    sku: getStr("sku"),
    description: getStr("description"),
    price: getNum("price") ?? 0,
    currency: "RUB",
    inStock: fd.get("inStock") != null,
    imageUrl: getStr("imageUrl"),
    material: getStr("material"),
    color: getStr("color"),
    pileHeight: getNum("pileHeightMm"),
    widthMm: getNum("rollWidthMm"),
  });

  return NextResponse.redirect(new URL(`/admin/products/${id}/edit`, req.url), 303);
}
