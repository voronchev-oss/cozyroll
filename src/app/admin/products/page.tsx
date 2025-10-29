// src/app/admin/products/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import { headers } from "next/headers";
import { listProducts } from "@/lib/db";
import { pickCsrfFromHeaders } from "@/lib/api-guard";

const price = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

export default async function AdminProducts() {
  const h = await headers();
  const csrf = pickCsrfFromHeaders(h as any);
  const items = await listProducts();

  return (
    <div className="grid gap-4 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link className="px-3 py-2 rounded bg-blue-600 text-white" href="/admin/products/new">
          Новый товар
        </Link>
      </div>

      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Название</th>
            <th className="p-2 text-left">Цена</th>
            <th className="p-2 text-left">Наличие</th>
            <th className="p-2 text-left">Действия</th>
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
                  <Link className="px-3 py-1 border rounded" href={`/admin/products/${p.id}/edit`}>
                    Редактировать
                  </Link>
                  <form action="/api/products/delete" method="POST">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="csrf" value={csrf} />
                    <button className="px-3 py-1 border rounded">Удалить</button>
                  </form>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
