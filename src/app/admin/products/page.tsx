// src/app/admin/products/page.tsx
import Link from "next/link";
import { headers } from "next/headers";
import { listProducts } from "@/lib/db";

export const runtime = "nodejs";

const priceFmt = (n: number) => new Intl.NumberFormat("ru-RU").format(n);

function pickCsrfFromHeaders(h: Headers) {
  const raw = h.get("cookie") || "";
  const m = raw.match(/cozyroll_csrf=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : "";
}

export default async function AdminProducts() {
  const h = headers();
  const csrf = pickCsrfFromHeaders(h);
  const items = await listProducts();

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <Link href="/admin/products/new" className="btn-primary">
          Добавить
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left">
              <th className="p-2">Название</th>
              <th className="p-2">Цена</th>
              <th className="p-2">Статус</th>
              <th className="p-2" />
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.title}</td>
                <td className="p-2">{priceFmt(p.price || 0)} ₽</td>
                <td className="p-2">{p.inStock ? "В наличии" : "Нет"}</td>
                <td className="p-2">
                  <div className="flex gap-2">
                    <Link href={`/admin/products/${p.id}/edit`} className="btn">
                      Редактировать
                    </Link>
                    <form action="/api/products/delete" method="POST">
                      <input type="hidden" name="csrf" value={csrf} />
                      <input type="hidden" name="id" value={p.id} />
                      <button className="btn-danger">Удалить</button>
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
