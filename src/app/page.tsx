import Link from "next/link";

export default function Home(){
  return (
    <section className="py-16">
      <div className="card card-pad">
        <span className="badge">Новый уровень выбора</span>
        <h1 className="h1 mt-3">Ковролин и ковры нового поколения</h1>
        <p className="mt-4 muted max-w-2xl">
          Подбор по фото, рекомендации и честные цены. Поможем выбрать с первого раза.
        </p>
        <div className="mt-6 flex gap-3">
          <Link href="/catalog" className="btn">Открыть каталог</Link>
          <Link href="/guide" className="btn-ghost">Гид по выбору</Link>
        </div>
      </div>
    </section>
  );
}
