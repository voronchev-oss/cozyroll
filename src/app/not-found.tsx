import Link from "next/link";
export default function NotFound(){
  return (
    <section className="py-20 text-center">
      <h1 className="h1">404</h1>
      <p className="muted mt-3">Страница не найдена</p>
      <div className="mt-6"><Link href="/" className="btn">На главную</Link></div>
    </section>
  );
}
