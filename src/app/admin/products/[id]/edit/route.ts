// src/app/api/admin/products/[id]/edit/route.ts
import { NextResponse } from "next/server";
import { updateProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";

export const runtime = "nodejs";

export async function POST(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  // доступ только админу
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const fd = await req.formData();
  const csrfCheck = await requireCsrf(fd);
  if (csrfCheck) return csrfCheck;

  const { id } = await ctx.params;
  const pid = decodeURIComponent(id || "");

  const getStr = (k: string) => {
    const v = fd.get(k);
    return v ? String(v).trim() : null;
    };
  const getNum = (k: string) => {
    const v = fd.get(k);
    if (v == null || String(v).trim() === "") return null;
    const n = Number(String(v).replace(/\s+/g, ""));
    return Number.isFinite(n) ? n : null;
  };

  const data = {
    sku: getStr("sku"),
    title: getStr("title") || "Без названия",
    description: getStr("description"),
    price: (() => {
      const rub = getNum("price") ?? 0; // человек ввёл рубли
      return Math.round(rub * 100);     // храним в копейках
    })(),
    inStock: fd.get("inStock") ? true : false,
    material: getStr("material"),
    color: getStr("color"),
    pileHeight: getNum("pileHeight"),
    widthMm: getNum("widthMm"),
    imageUrl: getStr("imageUrl"),
  } as const;

  await updateProduct(pid, data as any);

  const url = new URL(`/admin/products/${encodeURIComponent(pid)}/edit`, req.url);
  return NextResponse.redirect(url, 303);
}
