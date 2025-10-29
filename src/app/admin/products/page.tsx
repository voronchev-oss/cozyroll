// src/app/admin/products/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { listProducts } from "@/lib/db";
import { pickCsrfFromHeaders } from "@/lib/api-guard";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function AdminProducts() {
  const items = await listProducts();
  const h = await headers();
  const csrf = pickCsrfFromHeaders(h);

  const fmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Товары ({items.length})</h1>
        <Link href="/admin/products/new" className="px-3 py-2 border rounded">Новый</Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border rounded">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left">Название</th>
              <th className="p-2 text-left">Цена</th>
              <th className="p-2 text-left">Статус</th>
              <th className="p-2 text-left w-[220px]">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={String(p.id)} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{fmt(p.price || 0)} ₽</td>
                <td className="p-2">{p.inStock ? "В наличии" : "Нет"}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/products/${encodeURIComponent(String(p.id))}/edit`}
                      className="px-3 py-1 border rounded"
                    >
                      Редактировать
                    </Link>
                    <form action="/api/products/delete" method="POST">
                      <input type="hidden" name="id" value={String(p.id)} />
                      <input type="hidden" name="csrf" value={csrf} />
                      <button className="px-3 py-1 border rounded text-red-600">Удалить</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
