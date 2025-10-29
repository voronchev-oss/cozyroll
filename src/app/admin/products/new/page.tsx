// src/app/admin/products/new/page.tsx
export const runtime = "nodejs";

import { headers } from "next/headers";
import { pickCsrfFromHeaders } from "@/lib/api-guard";

export default async function NewProduct() {
  const h = await headers();
  const csrf = pickCsrfFromHeaders(h as any);

  return (
    <form action="/api/products" method="POST" className="grid gap-3 max-w-lg p-6">
      <h1 className="text-2xl font-semibold">Новый товар</h1>
      <input className="border p-2 rounded" name="title" placeholder="Название" required />
      <input className="border p-2 rounded" name="price" placeholder="Цена, ₽" />
      <input className="border p-2 rounded" name="sku" placeholder="Артикул" />
      <input className="border p-2 rounded" name="imageUrl" placeholder="URL картинки" />
      <input className="border p-2 rounded" name="material" placeholder="Материал" />
      <input className="border p-2 rounded" name="color" placeholder="Цвет" />
      <input className="border p-2 rounded" name="pileHeightMm" placeholder="Высота ворса, мм" />
      <input className="border p-2 rounded" name="rollWidthMm" placeholder="Ширина рулона, мм" />
      <label className="flex items-center gap-2">
        <input type="checkbox" name="inStock" defaultChecked /> В наличии
      </label>
      <input type="hidden" name="csrf" value={csrf} />
      <button className="px-3 py-2 rounded bg-blue-600 text-white">Добавить</button>
    </form>
  );
}
