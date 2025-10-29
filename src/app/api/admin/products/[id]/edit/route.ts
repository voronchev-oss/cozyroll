// src/app/api/admin/products/[id]/edit/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { updateProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

// В Next.js 16 params — это Promise
export async function POST(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  // 1) охрана (не читает body)
  const guard = await requireAdmin(req);
  if (guard) return guard;

  // 2) читаем тело ОДИН раз
  const fd = await req.formData();

  // 3) CSRF по уже прочитанной форме + req для cookie
  const csrfRes = await requireCsrf(fd, req);
  if (csrfRes) return csrfRes;

  const { id } = await ctx.params;

  const str = (k: string) => {
    const v = fd.get(k);
    const s = v == null ? "" : String(v).trim();
    return s.length ? s : null;
  };
  const num = (k: string) => {
    const v = fd.get(k);
    const s = v == null ? "" : String(v).replace(/\s+/g, "").trim();
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

  // 4) редирект назад в список (или оставаться на edit — как хочешь)
  return NextResponse.redirect(new URL("/admin/products", req.url), { status: 303 });
}
