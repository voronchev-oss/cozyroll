// src/app/admin/products/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { listProducts } from "@/lib/db";

function pickCsrf(h: Headers) {
  const raw = h.get("cookie") || "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export const runtime = "nodejs";

const fmt = (n: number) =>
  new Intl.NumberFormat("ru-RU").format(Math.round(n || 0));

export default async function AdminProducts() {
  const items = await listProducts();
  const h = await headers();                    // ВАЖНО: await
  const csrf = pickCsrf(h as unknown as Headers);

  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link className="px-3 py-2 rounded bg-blue-600 text-white" href="/admin/products/new">
          Новый товар
        </Link>
      </div>

      <div className="overflow-x-auto border rounded">
        <table className="min-w-[600px] w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-2">Артикул</th>
              <th className="text-left p-2">Название</th>
              <th className="text-left p-2">Цена</th>
              <th className="text-left p-2">Наличие</th>
              <th className="text-left p-2 w-48">Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.map(p => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.sku}</td>
                <td className="p-2">{p.title}</td>
                <td className="p-2">{fmt(p.price || 0)} ₽</td>
                <td className="p-2">{p.inStock ? "В наличии" : "Нет"}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="px-3 py-1 border rounded">
                      Редактировать
                    </Link>
                    <form action="/api/products/delete" method="POST">
                      <input type="hidden" name="id" value={p.id} />
                      <input type="hidden" name="csrf" value={csrf} />
                      <button className="px-3 py-1 border rounded text-red-600">
                        Удалить
                      </button>
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
