export default function Samples({ searchParams }:{ searchParams:{ [k:string]: string | string[] | undefined } }){
  const productId = typeof searchParams.productId === "string" ? searchParams.productId : "";
  return (
    <section className="py-10 max-w-2xl">
      <h1 className="h2">Запросить образцы</h1>
      <p className="muted mt-2">Оставьте контакты, мы привезём/вышлем образцы нужных оттенков и фактур.</p>

      <form method="POST" action="/api/samples" className="mt-6 grid gap-4">
        <input type="hidden" name="productId" defaultValue={productId}/>
        <label className="grid gap-2">Ваше имя* <input name="name" required className="border rounded-md px-3 py-2"/></label>
        <label className="grid gap-2">Телефон* <input name="phone" required className="border rounded-md px-3 py-2"/></label>
        <label className="grid gap-2">E-mail <input name="email" type="email" className="border rounded-md px-3 py-2"/></label>
        <label className="grid gap-2">Адрес (если нужна доставка) <input name="address" className="border rounded-md px-3 py-2"/></label>
        <label className="grid gap-2">Комментарий <textarea name="comment" rows={4} className="border rounded-md px-3 py-2"/></label>
        <button className="btn">Отправить заявку</button>
      </form>
    </section>
  );
}
