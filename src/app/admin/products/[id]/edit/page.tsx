export const runtime = "nodejs";
export const revalidate = 0;

import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = await getProduct(params.id);
  if (!p) return { title: "Товар не найден — Admin" };
  return { title: `Редактировать: ${p.title}` };
}

export default async function EditProductPage({ params }: Props) {
  const p = await getProduct(params.id);
  if (!p) return notFound();

  return (
    <form
      action={`/api/admin/products/${encodeURIComponent(p.id)}/edit`}
      method="POST"
      className="grid gap-3 max-w-xl"
    >
      <h1 className="text-2xl font-semibold">Редактировать: {p.title}</h1>

      <label className="grid gap-1">
        <span>Название</span>
        <input name="title" defaultValue={p.title} className="input" />
      </label>

      <label className="grid gap-1">
        <span>SKU</span>
        <input name="sku" defaultValue={p.sku ?? ""} className="input" />
      </label>

      <label className="grid gap-1">
        <span>Цена, ₽</span>
        <input name="price" type="number" defaultValue={p.price} className="input" />
      </label>

      <label className="grid gap-1">
        <span>В наличии</span>
        <input name="inStock" type="checkbox" defaultChecked={p.inStock} />
      </label>

      <label className="grid gap-1">
        <span>URL изображения</span>
        <input name="imageUrl" defaultValue={p.imageUrl ?? ""} className="input" />
      </label>

      <div className="flex gap-2 mt-2">
        <button className="btn btn-primary" type="submit">Сохранить</button>
        <a className="btn" href="/admin/products">Отмена</a>
      </div>
    </form>
  );
}

