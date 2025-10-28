import { cookies } from "next/headers";

export const runtime = "nodejs";
export default async function NewProduct(){
  const csrf = cookies().get('cozyroll_csrf')?.value || '';
  return (
    <form action="/api/products" method="POST" className="grid gap-3 max-w-lg">
      <h1 className="text-2xl font-semibold">Новый товар</h1>
      <input name="title" placeholder="Название" className="border p-2 rounded" required/>
      <input name="price" type="number" placeholder="Цена, ₽" className="border p-2 rounded"/>
      <input name="imageUrl" placeholder="Ссылка на изображение" className="border p-2 rounded"/>
      <textarea name="description" placeholder="Описание" className="border p-2 rounded"/>
      <input type="hidden" name="csrf" value={csrf}/>
      <button className="bg-blue-600 text-white rounded p-2">Создать</button>
    </form>
  );
}
