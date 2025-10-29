// src/app/admin/products/new/page.tsx
import Link from "next/link";
import { headers } from "next/headers";

function pickCsrf(h: Headers) {
  const raw = h.get("cookie") || "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export const runtime = "nodejs";

export default async function NewProduct() {
  const h = await headers();             // ВАЖНО: await
  const csrf = pickCsrf(h as unknown as Headers);

  return (
    <form action="/api/products" method="POST" className="grid gap-3 max-w-lg">
      <h1 className="text-2xl font-semibold">Новый товар</h1>

      <input type="hidden" name="csrf" value={csrf} />

      <label className="grid gap-1">
        <span>Артикул</span>
        <input name="sku" className="border rounded px-3 py-2" />
      </label>

      <label className="grid gap-1">
        <span>Название</span>
        <input name="title" required className="border rounded px-3 py-2" />
      </label>

      <label className="grid gap-1">
        <span>Описание</span>
        <textarea name="description" className="border rounded px-3 py-2" />
      </label>

      <label className="grid gap-1">
        <span>Цена, ₽</span>
        <input name="price" type="number" min="0" step="1" className="border rounded px-3 py-2" />
      </label>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" name="inStock" />
        В наличии
      </label>

      <div className="flex gap-3">
        <button className="px-4 py-2 rounded bg-blue-600 text-white">Создать</button>
        <Link href="/admin/products" className="px-4 py-2 rounded border">Отмена</Link>
      </div>
    </form>
  );
}
