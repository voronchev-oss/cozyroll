export const runtime = "nodejs"; export const revalidate = 0;
import { listProducts } from "@/lib/db";
import { cookies } from "next/headers";

export default async function AdminProducts(){
  const items = await listProducts();
  const csrf = cookies().get('cozyroll_csrf')?.value || '';
  return (
    <div className="grid gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Товары</h1>
        <a href="/admin/products/new" className="bg-blue-600 text-white rounded px-3 py-2">Добавить</a>
      </div>
      <div className="divide-y">
        {items.map(p=>(
          <div key={p.id} className="py-3 flex items-center gap-3">
            <div className="w-24">{p.image_url && <img src={p.image_url} className="rounded"/>}</div>
            <div className="flex-1">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-slate-500">{p.price.toLocaleString("ru-RU")} ₽</div>
            </div>
            <a className="underline" href={`/admin/products/${p.id}/edit`}>Редактировать</a>
            <form action="/api/products/delete" method="POST"
              onSubmit={(e)=>{ if(!confirm("Удалить?")) e.preventDefault(); }}>
              <input type="hidden" name="csrf" value={csrf}/>
              <input type="hidden" name="id" value={p.id}/>
              <button className="text-red-600 underline">Удалить</button>
            </form>
          </div>
        ))}
      </div>
      <form action="/api/auth/logout" method="POST">
        <button className="text-slate-600 underline">Выйти</button>
      </form>
    </div>
  );
}
