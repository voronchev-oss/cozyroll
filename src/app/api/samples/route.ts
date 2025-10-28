import { NextResponse } from "next/server";
import { createSample } from "../../../lib/db";

export async function POST(req: Request){
  const fd = await req.formData();
  const name = String(fd.get("name")||"").trim();
  const phone = String(fd.get("phone")||"").trim();
  const email = String(fd.get("email")||"").trim() || null;
  const address = String(fd.get("address")||"").trim() || null;
  const productId = String(fd.get("productId")||"").trim() || null;
  const comment = String(fd.get("comment")||"").trim() || null;

  if(!name || !phone) return NextResponse.json({error:"Имя и телефон обязательны"}, {status:400});
  await createSample({ name, phone, email, address, productId, comment });

  return NextResponse.redirect(new URL("/samples/success", req.url));
}
