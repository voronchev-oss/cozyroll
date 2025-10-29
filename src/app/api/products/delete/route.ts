import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const unauth = await requireAdmin(req);
  if (unauth) return unauth;

  const fd = await req.formData();
  if (!requireCsrf(req, fd)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const id = String(fd.get("id") || "");
  if (!id) return NextResponse.json({ error: "missing id" }, { status: 400 });

  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}

