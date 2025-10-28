"use client";

import { useState } from "react";

export default function NewProductPage(){
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>){
    e.preventDefault();
    setErr(""); setLoading(true);

    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/admin/products/new", { method: "POST", body: fd });
    setLoading(false);
    if(res.ok){
      location.href = "/admin/products";
    } else {
      const data = await res.json().catch(()=>({error:"Ошибка"}));
      setErr(data.error || "Ошибка");
    }
  }

  return (
    <section className="py-10 max-w-2xl">
      <h1 className="h2">Новый товар</h1>

      <form onSubmit={onSubmit} className="mt-6 grid gap-4">
        <label className="grid gap-2">Артикул* <input name="sku" required className="border rounded-md px-3 py-2"/></label>
        <label className="grid gap-2">Название* <input name="title" required className="border rounded-md px-3 py-2"/></label>
        <label className="grid gap-2">Описание <textarea name="description" rows={4} className="border rounded-md px-3 py-2"/></label>

        <label className="grid gap-2">Ссылка на фото
          <input name="imageUrl" placeholder="https://..." className="border rounded-md px-3 py-2"/>
          <span className="text-xs text-slate-500">Можно вставить ссылку с CDN (Cloudinary/Imgur) или путь из /public, например: <code>/img/cover.jpg</code></span>
        </label>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-2">Цена, ₽* <input name="price" type="number" step="0.01" required className="border rounded-md px-3 py-2"/></label>
          <label className="grid gap-2">В наличии <input type="checkbox" name="inStock" defaultChecked /></label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-2">Ширина рулона, мм <input name="rollWidthMm" type="number" className="border rounded-md px-3 py-2"/></label>
          <label className="grid gap-2">Высота ворса, мм <input name="pileHeightMm" type="number" step="0.1" className="border rounded-md px-3 py-2"/></label>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <label className="grid gap-2">Материал <input name="material" className="border rounded-md px-3 py-2"/></label>
          <label className="grid gap-2">Цвет <input name="color" className="border rounded-md px-3 py-2"/></label>
        </div>

        <button className="btn" disabled={loading}>{loading ? "Создаю..." : "Создать товар"}</button>
        {err && <div className="text-red-600 text-sm">{err}</div>}
      </form>
    </section>
  );
}
