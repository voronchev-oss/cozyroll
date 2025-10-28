// src/app/admin/products/new/page.tsx
import { cookies } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewProduct() {
  // В Next 16 cookies() -> Promise, значит ждём
  const store = await cookies();
  const csrf = store.get("cozyroll_csrf")?.value || "";

  return (
    <form action="/api/products" method="POST" className="grid gap-3 max-w-lg">
      <h1 className="text-2xl font-semibold">Новый товар</h1>

      <input type="hidden" name="csrf" value={csrf} />

      <label className="grid gap-1">
        <span>Артикул</span>
        <input name="sku" className="border rounded px-3 py-2" required />
      </label>

      <label className="grid gap-1">
        <span>Название</span>
        <input name="title" className="border rounded px-3 py-2" required />
      </label>

      <label className="grid gap-1">
        <span>Цена, ₽</span>
        <input name="price" type="number" className="border rounded px-3 py-2" />
      </label>

      <label className="inline-flex items-center gap-2">
        <input type="checkbox" name="inStock" />
        <span>В наличии</span>
      </label>

      <label className="grid gap-1">
        <span>Ширина рулона, мм</span>
        <input name="widthMm" type="number" className="border rounded px-3 py-2" />
      </label>

      <label className="grid gap-1">
        <span>Высота ворса, мм</span>
        <input name="pileHeight" type="number" className="border rounded px-3 py-2" />
      </label>

      <label className="grid gap-1">
        <span>Материал</span>
        <input name="material" className="border rounded px-3 py-2" />
      </label>

      <label className="grid gap-1">
        <span>Цвет</span>
        <input name="color" className="border rounded px-3 py-2" />
      </label>

      <label className="grid gap-1">
        <span>Описание</span>
        <textarea name="description" className="border rounded px-3 py-2" rows={4} />
      </label>

      <label className="grid gap-1">
        <span>URL изображения</span>
        <input name="imageUrl" className="border rounded px-3 py-2" placeholder="https://..." />
      </label>

      <button className="bg-blue-600 text-white rounded px-4 py-2">
        Создать товар
      </button>
    </form>
  );
}
