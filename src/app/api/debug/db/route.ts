// src/app/api/debug/db/route.ts
export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { Pool } from "pg";

function maskDbUrl(u: string) {
  try {
    const url = new URL(u);
    // host вида ep-***.neon.tech — это и есть ветка/пуллер
    const host = url.host;
    const db = url.pathname.replace(/^\//, "");
    const user = url.username ? url.username.replace(/.(?=.{2})/g, "•") : "";
    return { host, db, userMasked: user };
  } catch {
    return { host: "parse_error", db: "parse_error", userMasked: "" };
  }
}

export async function GET() {
  const url = process.env.DATABASE_URL || "";
  const meta = maskDbUrl(url);

  const pool = new Pool({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  // Какие колонки у таблицы products видит именно наш рантайм
  const cols = await pool.query<{
    column_name: string;
  }>(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_schema='public' AND table_name='products'
    ORDER BY column_name;
  `);

  // Мини-проверка одного инсерта "всухую" (без записи) — вернёт только список требуемых полей
  // Ничего не трогаем в БД, просто читаем схему
  await pool.end();

  return NextResponse.json({
    envSeenByServer: meta,             // host/db, к которым реально подключён прод
    productColumns: cols.rows.map(r => r.column_name), // что реально есть
  });
}
