// src/app/admin/products/new/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

export const runtime = "nodejs";

export default async function NewProduct() {
  // В Next 16 headers() → Promise → нужен await
  const h = await headers();

  // Достаём CSRF-токен из cookie (как строку)
  const raw = h.get("cookie") || "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  const csrf = m ? decodeURIComponent(m[1]) : "";

  return (
    <div className="grid gap-6 max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Новый товар</h1>
        <Link href="/admin/products" className="btn">Назад</Link>
      </div>

      <form action="/api/products" method="POST" className="grid gap-4">
        {/* CSRF — обязателен */}
        <input type="hidden" name="csrf" value={csrf} />

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Артикул (SKU)</span>
          <input name="sku" className="input" placeholder="Secret 03" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Название*</span>
          <input name="title" required className="input" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Описание</span>
          <textarea name="description" rows={4} className="input" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Цена, ₽*</span>
          <input name="price" type="number" min="0" step="1" required className="input" />
        </label>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" name="inStock" />
          <span>В наличии</span>
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Ширина рулона, мм</span>
            <input name="widthMm" type="number" min="0" step="1" className="input" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Высота ворса, мм</span>
            <input name="pileHeight" type="number" min="0" step="1" className="input" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Материал</span>
            <input name="material" className="input" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Цвет</span>
            <input name="color" className="input" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">URL изображения</span>
          <input name="imageUrl" className="input" placeholder="https://..." />
        </label>

        <div className="flex gap-3">
          <button className="btn-primary" type="submit">Создать</button>
          <Link href="/admin/products" className="btn">Отмена</Link>
        </div>
      </form>
    </div>
  );
}
