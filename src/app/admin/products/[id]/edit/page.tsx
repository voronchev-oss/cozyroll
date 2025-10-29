// src/app/admin/products/[id]/edit/page.tsx
import { notFound } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";
import { getProduct } from "@/lib/db";
import { pickCsrfFromHeaders } from "@/lib/api-guard";

export const runtime = "nodejs";
export const revalidate = 0;

const priceFmt = (c: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round((c || 0) / 100));

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const p = await getProduct(params.id);
  if (!p) return notFound();

  const csrf = pickCsrfFromHeaders(await headers());

  return (
    <div className="grid gap-6 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Редактировать: {p.title}</h1>
        <Link
          href="/admin/products"
          className="px-3 py-1.5 border rounded hover:bg-gray-50"
        >
          ← К списку
        </Link>
      </div>

      <form action="/api/products" method="POST" className="grid gap-4">
        {/* важно: для UPDATE передаём id и csrf */}
        <input type="hidden" name="id" value={p.id} />
        <input type="hidden" name="csrf" value={csrf} />

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Артикул</span>
          <input
            name="sku"
            defaultValue={p.sku ?? ""}
            className="border rounded px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Название*</span>
          <input
            name="title"
            defaultValue={p.title}
            required
            className="border rounded px-3 py-2"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">Описание</span>
          <textarea
            name="description"
            defaultValue={p.description ?? ""}
            rows={4}
            className="border rounded px-3 py-2"
          />
        </label>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Цена, ₽*</span>
            <input
              name="price"
              inputMode="numeric"
              defaultValue={priceFmt(p.price)}
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-600">В наличии</span>
            <input
              name="inStock"
              type="checkbox"
              defaultChecked={p.inStock}
              className="h-5 w-5"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Ширина рулона, мм</span>
            <input
              name="widthMm"
              inputMode="numeric"
              defaultValue={p.widthMm ?? ""}
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Высота ворса, мм</span>
            <input
              name="pileHeight"
              inputMode="numeric"
              defaultValue={p.pileHeight ?? ""}
              className="border rounded px-3 py-2"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Материал</span>
            <input
              name="material"
              defaultValue={p.material ?? ""}
              className="border rounded px-3 py-2"
            />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-gray-600">Цвет</span>
            <input
              name="color"
              defaultValue={p.color ?? ""}
              className="border rounded px-3 py-2"
            />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm text-gray-600">URL изображения</span>
          <input
            name="imageUrl"
            defaultValue={p.imageUrl ?? ""}
            className="border rounded px-3 py-2"
          />
        </label>

        <div className="flex gap-3">
          <button
            type="submit"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Сохранить
          </button>

          <Link
            href={`/product/${p.id}`}
            className="px-4 py-2 rounded border hover:bg-gray-50"
          >
            Открыть карточку товара
          </Link>
        </div>
      </form>
    </div>
  );
}
