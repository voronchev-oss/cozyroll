// src/app/product/[id]/page.tsx
import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const pid = String(decodeURIComponent(id));
  const p = await getProduct(pid);
  if (!p) return { title: "Товар не найден — CozyRoll" };
  return { title: p.title, description: p.description ?? undefined };
}

export default async function ProductPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pid = String(decodeURIComponent(id));
  const p = await getProduct(pid);
  if (!p) return notFound();

  return (
    <section className="container py-10">
      <h1 className="text-3xl font-semibold">{p.title}</h1>
      <div className="mt-2 text-muted">{p.price} ₽</div>
    </section>
  );
}
