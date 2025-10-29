// src/app/admin/products/[id]/edit/page.tsx
export const runtime = "nodejs";
export const revalidate = 0;

import Link from "next/link";
import { getProduct } from "@/lib/db";

type P = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: P) {
  const id = (await params).id; // Next 16: params — это Promise
  const p = await getProduct(id);

  if (!p) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Товар не найден</h1>
        <Link href="/admin/products" className="px-3 py-2 rounded bg-blue-600 text-white mt-4 inline-block">
          ← К списку
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">Редактировать: {p.title}</h1>
      <p className="mt-2 text-gray-500">ID: {p.id}</p>
      <Link href="/admin/products" className="px-3 py-2 rounded bg-blue-600 text-white mt-6 inline-block">
        ← К списку
      </Link>
    </div>
  );
}
