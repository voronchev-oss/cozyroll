import { NextResponse } from "next/server";
import { createProduct, listProducts } from "../../../lib/db";

export async function POST(req: Request){
  const b = await req.json();
  if(!b?.sku || !b?.title) return NextResponse.json({error:"SKU и Название обязательны"}, {status:400});
  const id = await createProduct({
    sku:String(b.sku), title:String(b.title), description:b.description?String(b.description):null,
    price:Math.round(Number(b.price)||0), currency:"RUB", inStock:!!b.inStock,
    widthMm:b.widthMm!=null?Number(b.widthMm):null, pileHeight:b.pileHeight!=null?Number(b.pileHeight):null,
    material:b.material?String(b.material):null, color:b.color?String(b.color):null
  });
  return NextResponse.json({ok:true,id},{status:201});
}

export async function GET(){ return NextResponse.json(await listProducts()); }
