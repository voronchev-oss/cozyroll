export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

import Link from "next/link";
import { listProducts, facetValues } from "@/lib/db";

const price = (c:number)=> new Intl.NumberFormat("ru-RU").format(Math.round(c/100));

export default async function Catalog({
  // В Next 16 searchParams — Promise
  searchParams,
}: {
  searchParams: Promise<{ [k: string]: string | string[] | undefined }>
}) {
  const sp = await searchParams;

  const q        = typeof sp.q === "string" ? sp.q : "";
  const color    = typeof sp.color === "string" ? sp.color : "";
  const material = typeof sp.material === "string" ? sp.material : "";
  const inStock  = sp.inStock === "1";

  const items = await listProducts({
    q,
    color: color || undefined,
    material: material || undefined,
    inStock: sp.inStock ? inStock : undefined,
  });

  const colors    = await facetValues("color");
  const materials = await facetValues("material");

  return (
    <section className="py-10">
      <h1 className="h2 mb-6">Каталог</h1>

      {/* Фильтры */}
      <form method="GET" className="card card-pad mb-6 grid sm:grid-cols-4 gap-3">
        <input name="q" defaultValue={q} placeholder="Поиск по названию/артикулу"
               className="border rounded-md px-3 py-2 sm:col-span-2"/>
        <select name="color" defaultValue={color} className="border rounded-md px-3 py-2">
          <option value="">Цвет (любой)</option>
          {colors.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        <select name="material" defaultValue={material} className="border rounded-md px-3 py-2">
          <option value="">Материал (любой)</option>
          {materials.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="inStock" value="1" defaultChecked={inStock}/> В наличии
        </label>
        <div className="sm:col-span-4">
          <button className="btn">Показать</button>
          <Link href="/catalog" className="btn-ghost ml-2">Сбросить</Link>
        </div>
      </form>

      {/* Список */}
      {items.length === 0 ? (
        <p className="muted">Ничего не найдено.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((p)=>(
            <li key={p.id}>
              <Link
                href={`/product/${encodeURIComponent(p.id)}`}
                prefetch={false}
                className="card overflow-hidden block group focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {p.imageUrl ? (
                  <img src={p.imageUrl} alt={p.title} className="w-full h-40 object-cover transition-transform duration-200 group-hover:scale-[1.02]"/>
                ) : (
                  <div className="w-full h-40 bg-black/5" />
                )}
                <div className="card-pad">
                  <div className="text-xs muted mb-1">{p.sku}</div>
                  <div className="block font-medium group-hover:underline">{p.title}</div>
                  <div className="mt-3 font-semibold">{price(p.price)} ₽</div>
                  <div className="text-sm muted">{p.inStock ? "В наличии" : "Нет в наличии"}</div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
