export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { getProduct } from "../../../lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

const priceFmt = (c:number)=> new Intl.NumberFormat("ru-RU").format(Math.round(c/100));

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const key = decodeURIComponent(id);
  const p = await getProduct(key);
  if(!p) return { title: "Товар не найден — CozyRoll" };

  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const url  = `${site}/product/${encodeURIComponent(p.id)}`;

  return {
    title: p.title,
    description: p.description ?? `${p.title} — купить в CozyRoll`,
    alternates: { canonical: url },
    openGraph: { title: p.title, description: p.description ?? "", url, siteName: "CozyRoll", type: "website" },
  };
}

export default async function ProductPage(
  { params }: { params: Promise<{ id: string }> }
){
  const { id } = await params;
  const key = decodeURIComponent(id);
  const p = await getProduct(key);
  if(!p) return notFound();

  const structuredData = {
    "@context":"https://schema.org/",
    "@type":"Product",
    name: p.title,
    sku: p.sku,
    description: p.description || "",
    image: p.imageUrl || undefined,
    offers: {
      "@type":"Offer",
      priceCurrency: p.currency || "RUB",
      price: (p.price/100).toFixed(2),
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000"}/product/${encodeURIComponent(p.id)}`
    }
  };

  return (
    <section className="py-10 grid lg:grid-cols-2 gap-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(structuredData)}} />
      <div className="card overflow-hidden">
        {p.imageUrl ? (
          <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover"/>
        ) : (
          <div className="aspect-[4/3] bg-black/5" />
        )}
      </div>
      <div>
        <div className="text-xs muted mb-2">{p.sku}</div>
        <h1 className="h2">{p.title}</h1>
        <div className="mt-3 text-lg font-semibold">{priceFmt(p.price)} ₽</div>
        <div className="muted">{p.inStock ? "В наличии" : "Нет в наличии"}</div>
        {p.description && <p className="mt-6">{p.description}</p>}
        <form action="/samples" method="GET" className="mt-6">
          <input type="hidden" name="productId" value={p.id} />
          <button className="btn">Запросить образцы</button>
        </form>
      </div>
    </section>
  );
}
