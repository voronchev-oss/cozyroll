import { NextResponse } from "next/server";
import { deleteProduct } from "@/lib/db";
import { requireAdmin, requireCsrf } from "@/lib/api-guard";
export const runtime = "nodejs";

export async function POST(req: Request) {
  const guard = await requireAdmin(req);
  if (guard) return guard;

  const fd = await req.formData();
  if (!requireCsrf(req, fd)) {
    return NextResponse.json({ error: "bad csrf" }, { status: 403 });
  }

  const id = String(fd.get("id") || "");
  if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
