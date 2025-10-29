// src/app/api/debug/db/route.ts
import { NextResponse } from "next/server";
import { Pool } from "pg";

export const runtime = "nodejs";

export async function GET() {
  const url = process.env.DATABASE_URL || "";

  // чуть-чуть распарсим строку подключения: host и имя БД
  const m = url.match(/@([^/]+)\/([^?]+)/);
  const host = m?.[1] || null;
  const dbname = m?.[2] || null;

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  try {
    const { rows } = await pool.query(
      `SELECT column_name
         FROM information_schema.columns
        WHERE table_schema='public' AND table_name='products'
        ORDER BY 1`
    );
    const productColumns = rows.map((r: any) => r.column_name);

    return NextResponse.json({
      envSeenByServer: { host, dbname },
      productColumns,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: String(e?.message || e) },
      { status: 500 }
    );
  } finally {
    await pool.end().catch(() => {});
  }
}
