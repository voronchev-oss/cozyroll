// src/lib/db.ts — Postgres (Neon)
import { Pool } from "pg";

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL не задан. Проверь .env.local");
}

export type Product = {
  id: string;
  sku: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string | null;
  inStock: boolean;
  color: string | null;
  material: string | null;
  pileHeightMm: number | null;
  rollWidthMm: number | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

// cтрока БД (как лежит в Postgres)
type ProductRow = {
  id: string;
  sku: string | null;
  title: string;
  description: string | null;
  price: number;
  currency: string | null;
  in_stock: boolean;
  color: string | null;
  material: string | null;
  pile_height_mm: number | null;
  roll_width_mm: number | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // для Neon
});

function mapRow(r: ProductRow): Product {
  return {
    id: r.id,
    sku: r.sku,
    title: r.title,
    description: r.description,
    price: Number(r.price),
    currency: r.currency,
    inStock: r.in_stock,
    color: r.color,
    material: r.material,
    pileHeightMm: r.pile_height_mm,
    rollWidthMm: r.roll_width_mm,
    imageUrl: r.image_url,
    createdAt: r.created_at,
    updatedAt: r.updated_at,
  };
}

// ===== helpers

async function q<T = any>(sql: string, args: any[] = []) {
  try {
    const res = await pool.query<T>(sql, args);
    return res;
  } catch (err: any) {
    // дадим понятное сообщение
    throw new Error(`DB error: ${err?.message || String(err)} (sql: ${sql})`);
  }
}

// ===== API

export async function getProduct(id: string): Promise<Product | null> {
  const { rows } = await q<ProductRow>("SELECT * FROM products WHERE id = $1", [id]);
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function listProducts(opts: {
  q?: string;
  color?: string;
  material?: string;
  inStock?: boolean;
} = {}): Promise<Product[]> {
  const conds: string[] = [];
  const args: any[] = [];
  let i = 1;

  if (opts.q) {
    conds.push(`(title ILIKE $${i} OR sku ILIKE $${i})`);
    args.push(`%${opts.q}%`);
    i++;
  }
  if (opts.color) { conds.push(`color = $${i}`); args.push(opts.color); i++; }
  if (opts.material) { conds.push(`material = $${i}`); args.push(opts.material); i++; }
  if (typeof opts.inStock === "boolean") { conds.push(`in_stock = $${i}`); args.push(opts.inStock); i++; }

  const where = conds.length ? `WHERE ${conds.join(" AND ")}` : "";
  const sql = `
    SELECT * FROM products
    ${where}
    ORDER BY created_at DESC
    LIMIT 200
  `;
  const { rows } = await q<ProductRow>(sql, args);
  return rows.map(mapRow);
}

export async function facetValues(column: "color" | "material"): Promise<string[]> {
  const { rows } = await q<{ [k: string]: string | null }>(
    `SELECT DISTINCT ${column} FROM products WHERE ${column} IS NOT NULL ORDER BY ${column} ASC`
  );
  return rows.map((r) => r[column] as string);
}

export async function createProduct(data: Partial<Product>): Promise<Product> {
  const { rows } = await q<ProductRow>(
    `INSERT INTO products
     (sku, title, description, price, currency, in_stock, color, material, pile_height_mm, roll_width_mm, image_url)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      data.sku ?? null,
      data.title ?? "Без названия",
      data.description ?? null,
      data.price ?? 0,
      data.currency ?? "RUB",
      data.inStock ?? true,
      data.color ?? null,
      data.material ?? null,
      data.pileHeightMm ?? null,
      data.rollWidthMm ?? null,
      data.imageUrl ?? null,
    ]
  );
  return mapRow(rows[0]);
}

export async function updateProduct(id: string, data: Partial<Product>): Promise<Product> {
  const { rows } = await q<ProductRow>(
    `UPDATE products SET
      sku=$1, title=$2, description=$3, price=$4, currency=$5, in_stock=$6,
      color=$7, material=$8, pile_height_mm=$9, roll_width_mm=$10, image_url=$11,
      updated_at=now()
     WHERE id=$12
     RETURNING *`,
    [
      data.sku ?? null,
      data.title ?? "Без названия",
      data.description ?? null,
      data.price ?? 0,
      data.currency ?? "RUB",
      data.inStock ?? true,
      data.color ?? null,
      data.material ?? null,
      data.pileHeightMm ?? null,
      data.rollWidthMm ?? null,
      data.imageUrl ?? null,
      id,
    ]
  );
  return mapRow(rows[0]);
}

export async function deleteProduct(id: string): Promise<void> {
  await q("DELETE FROM products WHERE id=$1", [id]);
}

