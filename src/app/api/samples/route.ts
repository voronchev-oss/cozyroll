import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // TODO: позже запишем заявку в БД (Neon).
  return NextResponse.json({ ok: true });
}
