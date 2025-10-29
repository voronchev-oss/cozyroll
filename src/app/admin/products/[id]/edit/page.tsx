// src/app/admin/products/[id]/edit/page.tsx
import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const runtime = "nodejs";
export const revalidate = 0;

export async function generateMetadata(
  { params }: { params: Promise<{ id: string }> }
): Promise<Metadata> {
  const { id } = await params;
  const pid = decodeURIComponent(id);
  const p = await getProduct(pid);
  return { title: p ? `Редактировать: ${p.title}` : "Товар не найден" };
}

export default async function EditProductPage(
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const pid = decodeURIComponent(id);
  const p = await getProduct(pid);
  if (!p) return notFound();

  return (
    <div className="container py-8 grid gap-4">
      <h1 className="text-2xl font-semibold">Редактировать: {p.title}</h1>
      {/* здесь твоя форма редактирования (можно позже) */}
    </div>
  );
}

