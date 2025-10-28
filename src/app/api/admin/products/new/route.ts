import { NextResponse } from "next/server";
import { createProduct } from "../../../../../lib/db";

export async function POST(req: Request){
  const fd = await req.formData();
  const priceRub = parseFloat(String(fd.get("price")||"0").replace(",", "."));
  if(!fd.get("sku") || !fd.get("title") || !priceRub) {
    return NextResponse.json({error:"Заполните SKU, Название и Цену"}, {status:400});
  }

  await createProduct({
    sku: String(fd.get("sku")),
    title: String(fd.get("title")),
    description: (fd.get("description") ? String(fd.get("description")) : null),
    price: priceRub,
    inStock: !!fd.get("inStock"),
    widthMm: fd.get("widthMm") ? Number(fd.get("widthMm")) : null,
    pileHeight: fd.get("pileHeight") ? Number(fd.get("pileHeight")) : null,
    material: fd.get("material") ? String(fd.get("material")) : null,
    color: fd.get("color") ? String(fd.get("color")) : null,
    imageUrl: fd.get("imageUrl") ? String(fd.get("imageUrl")) : null,
  });

  return NextResponse.json({ok:true});
}
