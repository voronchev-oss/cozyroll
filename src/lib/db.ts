// src/lib/db.ts
import { Pool, QueryResultRow } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL не задан. Проверь .env.local и Vercel → Settings → Environment Variables"
  );
}

export type Product = {
  id: string;
  sku: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: "RUB";
  inStock: boolean;
  imageUrl: string | null;
  material: string | null;
  color: string | null;

  // camelCase в коде ←→ snake_case в БД
  // В БД: pile_height_mm, roll_width_mm
  pileHeight: number | null;
  widthMm: number | null;

  created_at?: string;
  updated_at?: string;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

/** Универсальный помощник с понятными ошибками */
async function q<T extends QueryResultRow = any>(sql: string, args: any[] = []) {
  try {
    const res = await pool.query<T>(sql, args);
    return res;
  } catch (err: any) {
    throw new Error(`DB error: ${err?.message || String(err)} (sql: ${sql})`);
  }
}

/** Маппер snake_case → camelCase */
function mapRow(r: any): Product {
  return {
    id: r.id,
    sku: r.sku,
    title: r.title,
    description: r.description,
    price: r.price,
    currency: r.currency,
    inStock: r.in_stock,
    imageUrl: r.image_url,
    material: r.material,
    color: r.color,

    // поддерживаем оба варианта на всякий случай
    pileHeight: r.pile_height_mm ?? r.pile_height ?? null,
    widthMm: r.roll_width_mm ?? r.width_mm ?? null,

    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

export async function listProducts(): Promise<Product[]> {
  const { rows } = await q(`SELECT * FROM products ORDER BY created_at DESC`);
  return rows.map(mapRow);
}

export async function getProduct(id: string): Promise<Product | null> {
  const { rows } = await q(`SELECT * FROM products WHERE id = $1`, [id]);
  return rows[0] ? mapRow(rows[0]) : null;
}

/** Создание товара — ВАЖНО: пишем в pile_height_mm и roll_width_mm */
export async function createProduct(data: Partial<Product>): Promise<string> {
  const sql = `
    INSERT INTO products (
      sku, title, description, price, currency, in_stock,
      image_url, material, color, pile_height_mm, roll_width_mm
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
    RETURNING id
  `;
  const args = [
    data.sku ?? null,
    data.title ?? "Без названия",
    data.description ?? null,
    Math.round(Number(data.price) || 0),
    "RUB",
    !!data.inStock,
    data.imageUrl ?? null,
    data.material ?? null,
    data.color ?? null,
    data.pileHeight ?? null, // ← в БД колонка pile_height_mm
    data.widthMm ?? null,    // ← в БД колонка roll_width_mm
  ];
  const { rows } = await q<{ id: string }>(sql, args);
  return rows[0].id; // UUID строка
}

export async function updateProduct(
  id: string,
  data: Partial<Product>
): Promise<Product> {
  const sql = `
    UPDATE products SET
      sku = $1,
      title = $2,
      description = $3,
      price = $4,
      currency = $5,
      in_stock = $6,
      image_url = $7,
      material = $8,
      color = $9,
      pile_height_mm = $10,
      roll_width_mm = $11,
      updated_at = now()
    WHERE id = $12
    RETURNING *
  `;
  const args = [
    data.sku ?? null,
    data.title ?? "Без названия",
    data.description ?? null,
    Math.round(Number(data.price) || 0),
    "RUB",
    !!data.inStock,
    data.imageUrl ?? null,
    data.material ?? null,
    data.color ?? null,
    data.pileHeight ?? null, // ← pile_height_mm
    data.widthMm ?? null,    // ← roll_width_mm
    id,
  ];
  const { rows } = await q(sql, args);
  return mapRow(rows[0]);
}

export async function deleteProduct(id: string): Promise<void> {
  await q(`DELETE FROM products WHERE id = $1`, [id]);
}

/** Значения для фильтров каталога (цвета, материалы) */
export async function facetValues(): Promise<{ colors: string[]; materials: string[] }> {
  const { rows } = await q<any>(`SELECT color, material FROM products`);
  const colors = Array.from(
    new Set(rows.map((r: any) => r.color).filter((v: any): v is string => !!v?.trim()))
  ).sort((a, b) => a.localeCompare(b, "ru"));
  const materials = Array.from(
    new Set(rows.map((r: any) => r.material).filter((v: any): v is string => !!v?.trim()))
  ).sort((a, b) => a.localeCompare(b, "ru"));
  return { colors, materials };
}
