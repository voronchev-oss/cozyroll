// src/app/admin/products/[id]/edit/page.tsx
import { headers } from "next/headers";
import Link from "next/link";
import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import { pickCsrfFromHeaders } from "@/lib/api-guard";

export const runtime = "nodejs";
export const revalidate = 0;

const UUIDv4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function AdminEditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pid = decodeURIComponent(id || "");
  if (!UUIDv4.test(pid)) return notFound();

  const p = await getProduct(pid);
  if (!p) return notFound();

  // CSRF из cookie → hidden input
  const csrf = pickCsrfFromHeaders(await headers());

  const priceFmt = (c: number) =>
    new Intl.NumberFormat("ru-RU").format(Math.round((c || 0) / 100));

  return (
    <div className="grid gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Редактировать: {p.title}</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          ← К списку
        </Link>
      </div>

      <form
        action={`/api/admin/products/${encodeURIComponent(p.id)}/edit`}
        method="POST"
        className="grid gap-4"
      >
        <input type="hidden" name="csrf" value={csrf} />

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Артикул (SKU)</label>
          <input name="sku" defaultValue={p.sku ?? ""} className="border p-2 rounded" />
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Название</label>
          <input name="title" defaultValue={p.title} required className="border p-2 rounded" />
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Описание</label>
          <textarea name="description" defaultValue={p.description ?? ""} className="border p-2 rounded min-h-[120px]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Цена, ₽ (целое число)</label>
            <input
              name="price"
              defaultValue={priceFmt(p.price)}
              className="border p-2 rounded"
              inputMode="numeric"
            />
          </div>

          <div className="grid gap-1">
            <label className="text-sm text-gray-600">В наличии</label>
            <input type="checkbox" name="inStock" defaultChecked={p.inStock} className="w-5 h-5" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Материал</label>
            <input name="material" defaultValue={p.material ?? ""} className="border p-2 rounded" />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Цвет</label>
            <input name="color" defaultValue={p.color ?? ""} className="border p-2 rounded" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Высота ворса, мм</label>
            <input
              name="pileHeight"
              defaultValue={p.pileHeight ?? ""}
              className="border p-2 rounded"
              inputMode="numeric"
            />
          </div>
          <div className="grid gap-1">
            <label className="text-sm text-gray-600">Ширина рулона, мм</label>
            <input
              name="widthMm"
              defaultValue={p.widthMm ?? ""}
              className="border p-2 rounded"
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="grid gap-1">
          <label className="text-sm text-gray-600">Ссылка на изображение</label>
          <input name="imageUrl" defaultValue={p.imageUrl ?? ""} className="border p-2 rounded" />
        </div>

        <div className="flex gap-3">
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Сохранить</button>
          <Link
            href={`/product/${encodeURIComponent(p.id)}`}
            className="px-4 py-2 rounded border"
          >
            Открыть карточку товара
          </Link>
        </div>
      </form>
    </div>
  );
}
