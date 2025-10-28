import Link from "next/link";
import { listProducts } from "@/lib/db";
const price = (c:number)=> new Intl.NumberFormat("ru-RU").format(Math.round(c/100));

export default async function AdminProducts(){
  const items = await listProducts();
  return (
    <section className="py-10">
      <div className="flex items-center justify-between">
        <h1 className="h2">Товары</h1>
        <Link className="btn" href="/admin/products/new">Добавить</Link>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr><th className="py-2 pr-4">Название</th><th className="py-2 pr-4">SKU</th><th className="py-2 pr-4">Цена</th><th className="py-2 pr-4">Наличие</th><th/></tr>
          </thead>
          <tbody>
            {items.map(p=>(
              <tr key={p.id} className="border-t">
                <td className="py-2 pr-4">{p.title}</td>
                <td className="py-2 pr-4">{p.sku}</td>
                <td className="py-2 pr-4">{price(p.price)} ₽</td>
                <td className="py-2 pr-4">{p.inStock?"Да":"Нет"}</td>
                <td className="py-2 text-right">
                  <Link className="underline mr-3" href={`/admin/products/${p.id}/edit`}>Редактировать</Link>
                  <form action="/api/products/delete" method="POST" className="inline">
                    <input type="hidden" name="id" value={p.id}/>
                    <button className="text-red-600 underline">Удалить</button>
                  </form>
                </td>
              </tr>
            ))}
            {items.length===0 && (<tr><td className="py-6 text-slate-600" colSpan={5}>Пока пусто. Нажми «Добавить».</td></tr>)}
          </tbody>
        </table>
      </div>
    </section>
  );
}
