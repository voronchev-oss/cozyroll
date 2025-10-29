// src/app/admin/products/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { listProducts } from "@/lib/db";

export const runtime = "nodejs";

const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export default async function AdminProducts() {
  // В Next 16 headers() -> Promise
  const h = await headers();
  // Достаём CSRF-токен из cookie
  const raw = h.get("cookie") || "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  const csrf = m ? decodeURIComponent(m[1]) : "";

  const items = await listProducts();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link href="/admin/products/new" className="bg-blue-600 text-white rounded px-4 py-2">
          Добавить
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Название</th>
              <th className="p-2">Цена</th>
              <th className="p-2">Наличие</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{fmt(p.price || 0)} ₽</td>
                <td className="p-2">{p.inStock ? "В наличии" : "Нет"}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="px-3 py-1 border rounded">
                      Редактировать
                    </Link>
                    <form action="/api/products/delete" method="POST">
                      <input type="hidden" name="csrf" value={csrf} />
                      <input type="hidden" name="id" value={p.id} />
                      <button className="px-3 py-1 border rounded text-red-600">Удалить</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td className="p-4 text-slate-500" colSpan={4}>
                  Товаров пока нет.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
