import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/db";

export async function POST(req: Request){
  const fd = await req.formData();
  const id = String(fd.get("id")||"");
  if(!id) return NextResponse.json({error:"no id"},{status:400});
  await deleteProduct(id);
  return NextResponse.redirect(new URL("/admin/products", req.url));
}
