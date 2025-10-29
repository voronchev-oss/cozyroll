// src/app/admin/products/page.tsx
import Link from "next/link";
import { listProducts } from "@/lib/db";

export const runtime = "nodejs";
export const revalidate = 0;

const price = (rub: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round((rub || 0) / 100));

export default async function AdminProducts() {
  const items = await listProducts();

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link
          href="/admin/products/new"
          className="px-3 py-1 rounded bg-blue-600 text-white"
        >
          + Новый товар
        </Link>
      </div>

      <div className="overflow-x-auto rounded border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left p-2">Название</th>
              <th className="text-left p-2">Цена</th>
              <th className="text-left p-2">Наличие</th>
              <th className="text-left p-2 w-48">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{price(p.price)} ₽</td>
                <td className="p-2">{p.inStock ? "В наличии" : "Нет"}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      className="px-3 py-1 border rounded hover:bg-gray-50"
                    >
                      Редактировать
                    </Link>
                    <form action="/api/products/delete" method="POST">
                      <input type="hidden" name="id" value={p.id} />
                      <button className="px-3 py-1 border rounded hover:bg-red-50">
                        Удалить
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-gray-500" colSpan={4}>
                  Пусто. Добавьте первый товар.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
