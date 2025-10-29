// src/app/api/admin/products/[id]/edit/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/lib/db";
import { requireAdmin } from "@/lib/api-guard";

// ВАЖНО: params — Promise в Next.js 16
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;

  // охрана админки (принимает Request/NextRequest)
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const fd = await req.formData();

  const str = (k: string) => {
    const v = fd.get(k);
    const s = v == null ? "" : String(v).trim();
    return s.length ? s : null;
  };
  const num = (k: string) => {
    const v = fd.get(k);
    const s = v == null ? "" : String(v).trim();
    return s.length ? Number(s) : null;
  };

  await updateProduct(id, {
    title: str("title") ?? "Без названия",
    sku: str("sku"),
    price: Math.round(Number(num("price") ?? 0)),
    inStock: fd.get("inStock") !== null,
    imageUrl: str("imageUrl"),
    material: str("material"),
    color: str("color"),
    pileHeight: num("pileHeight"),
    widthMm: num("widthMm"),
  });

  // после сохранения — назад в список
  return NextResponse.redirect(new URL("/admin/products", req.url), {
    status: 303,
  });
}
