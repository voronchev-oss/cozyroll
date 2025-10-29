// src/app/admin/products/[id]/edit/page.tsx
import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function AdminEditProductPage({
  params,
}: { params: { id: string } }) {
  const id = decodeURIComponent(params.id);
  const p = await getProduct(id);
  if (!p) return notFound();

  return (
    <div className="grid gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Редактировать: {p.title}</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      {/* Здесь позже можно вернуть полноценную форму редактирования.
          Пока просто показываем ID, чтобы страница точно рендерилась. */}
      <div className="rounded border p-4 text-sm">
        <div className="text-muted-foreground">ID: {p.id}</div>
      </div>
    </div>
  );
}
