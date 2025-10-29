// src/app/admin/products/new/page.tsx
import { headers } from "next/headers";

export const runtime = "nodejs";

function pickCsrfFromHeaders(h: Headers) {
  const raw = h.get("cookie") || "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export default function NewProduct() {
  const h = headers();
  const csrf = pickCsrfFromHeaders(h);

  return (
    <form action="/api/products" method="POST" className="grid gap-3 max-w-lg">
      <h1 className="text-2xl font-semibold">Новый товар</h1>

      {/* ОБЯЗАТЕЛЬНО: CSRF */}
      <input type="hidden" name="csrf" value={csrf} />

      <label className="grid gap-1">
        <span>Артикул</span>
        <input name="sku" className="input" />
      </label>

      <label className="grid gap-1">
        <span>Название</span>
        <input name="title" className="input" />
      </label>

      <label className="grid gap-1">
        <span>Описание</span>
        <textarea name="description" className="textarea" />
      </label>

      <label className="grid gap-1">
        <span>Цена, ₽</span>
        <input name="price" type="number" step="1" className="input" />
      </label>

      <label className="grid gap-1">
        <span>Ширина рулона, мм</span>
        <input name="widthMm" type="number" className="input" />
      </label>

      <label className="grid gap-1">
        <span>Высота ворса, мм</span>
        <input name="pileHeight" type="number" className="input" />
      </label>

      <label className="grid gap-1">
        <span>Материал</span>
        <input name="material" className="input" />
      </label>

      <label className="grid gap-1">
        <span>Цвет</span>
        <input name="color" className="input" />
      </label>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" name="inStock" />
        <span>В наличии</span>
      </label>

      <button className="btn-primary">Создать товар</button>
    </form>
  );
}

