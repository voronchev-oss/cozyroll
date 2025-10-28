import Link from "next/link";
export default function Success(){
  return (
    <section className="py-20 text-center">
      <h1 className="h2">Заявка отправлена</h1>
      <p className="muted mt-2">Менеджер свяжется с вами в ближайшее время.</p>
      <div className="mt-6"><Link href="/catalog" className="btn">Вернуться в каталог</Link></div>
    </section>
  );
}
