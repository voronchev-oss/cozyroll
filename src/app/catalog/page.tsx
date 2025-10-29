// src/app/catalog/page.tsx
import Link from "next/link";
import { listProducts, facetValues } from "@/lib/db";

export const runtime = "nodejs";
export const revalidate = 0;

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(Math.round(n || 0));

export default async function Catalog({
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>;
}) {
  // Next 16: searchParams — Promise → ждём
  const sp = await searchParams;

  const q = typeof sp.q === "string" ? sp.q : "";
  const color = typeof sp.color === "string" ? sp.color : undefined;
  const material = typeof sp.material === "string" ? sp.material : undefined;
  const inStock = sp.inStock === "1";

  // Берём товары с фильтрами
  const items = await listProducts({ q, color, material, inStock });

  // Берём справочники для фильтров (оба сразу)
  const { colors, materials } = await facetValues();

  return (
    <section className="container py-8 grid gap-6">
      <h1 className="text-2xl font-semibold">Каталог</h1>

      {/* Фильтры (минимальная форма, можно доработать позже) */}
      <form method="GET" className="grid md:grid-cols-5 gap-3">
        <input
          type="text"
          name="q"
          defaultValue={q}
          placeholder="Поиск (название, артикул, цвет, материал)"
          className="md:col-span-2 border rounded px-3 py-2"
        />

        <select name="color" defaultValue={color || ""} className="border rounded px-3 py-2">
          <option value="">Цвет (любой)</option>
          {colors.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select name="material" defaultValue={material || ""} className="border rounded px-3 py-2">
          <option value="">Материал (любой)</option>
          {materials.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <label className="inline-flex items-center gap-2 border rounded px-3 py-2">
          <input type="checkbox" name="inStock" defaultChecked={inStock} value="1" />
          В наличии
        </label>

        <div className="md:col-span-5">
          <button className="px-4 py-2 rounded bg-blue-600 text-white">Применить</button>
        </div>
      </form>

      {/* Сетка карточек */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p) => (
          <Link
            key={p.id}
            href={`/product/${encodeURIComponent(String(p.id))}`}
            className="block border rounded hover:shadow transition overflow-hidden"
          >
            {p.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={p.imageUrl} alt={p.title} className="w-full h-48 object-cover" />
            ) : (
              <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                Нет фото
              </div>
            )}
            <div className="p-3 grid gap-1">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-gray-600">
                {fmt(p.price)} ₽ {p.inStock ? "• в наличии" : "• нет в наличии"}
              </div>
            </div>
          </Link>
        ))}

        {items.length === 0 && (
          <div className="text-gray-500">Ничего не найдено. Измени фильтры и попробуй ещё раз.</div>
        )}
      </div>
    </section>
  );
}
