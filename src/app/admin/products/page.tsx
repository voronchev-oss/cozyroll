// src/app/admin/products/page.tsx
import Link from "next/link";
import { cookies } from "next/headers";
import { listProducts } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProducts() {
  const items = await listProducts();

  // В Next.js 16 cookies() возвращает Promise -> НУЖЕН await
  const store = await cookies();
  const csrf = store.get("cozyroll_csrf")?.value || "";

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link
          href="/admin/products/new"
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Добавить товар
        </Link>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="text-left border-b">
            <th className="py-2 pr-4">Артикул</th>
            <th className="py-2 pr-4">Название</th>
            <th className="py-2 pr-4">Цена</th>
            <th className="py-2 pr-4">Наличие</th>
            <th className="py-2">Действия</th>
          </tr>
        </thead>
        <tbody>
          {items.map((p) => (
            <tr key={p.id} className="border-b">
              <td className="py-2 pr-4">{p.sku}</td>
              <td className="py-2 pr-4">
                <Link
                  href={`/product/${encodeURIComponent(p.id)}`}
                  className="underline"
                >
                  {p.title}
                </Link>
              </td>
              <td className="py-2 pr-4">
                {Intl.NumberFormat("ru-RU").format(p.price || 0)} ₽
              </td>
              <td className="py-2 pr-4">{p.inStock ? "Да" : "Нет"}</td>
              <td className="py-2">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${encodeURIComponent(
                      p.id
                    )}/edit`}
                    className="px-3 py-1 border rounded"
                  >
                    Редактировать
                  </Link>

                  <form action="/api/products/delete" method="POST">
                    <input type="hidden" name="csrf" value={csrf} />
                    <input type="hidden" name="id" value={p.id} />
                    <button className="px-3 py-1 border rounded text-red-600">
                      Удалить
                    </button>
                  </form>
                </div>
              </td>
            </tr>
          ))}

          {items.length === 0 && (
            <tr>
              <td className="py-6 text-muted" colSpan={5}>
                Товаров пока нет.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
