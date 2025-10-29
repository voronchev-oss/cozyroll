// src/app/admin/products/[id]/edit/page.tsx
import { getProduct } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";

export const runtime = "nodejs";
export const revalidate = 0;

// простая проверка что это UUID v4 (чтобы не ходить в БД с мусором)
const UUIDv4 =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export default async function AdminEditProductPage({
  params,
}: {
  // В Next 16 params — Promise
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;                 // ← вот этого раньше не было
  const pid = decodeURIComponent(id || "");

  if (!UUIDv4.test(pid)) return notFound();

  const p = await getProduct(pid);
  if (!p) return notFound();

  return (
    <div className="grid gap-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Редактировать: {p.title}</h1>
        <Link href="/admin/products" className="text-blue-600 hover:underline">
          ← Назад к списку
        </Link>
      </div>

      {/* здесь позже вернём полноценную форму; сейчас просто выводим ID */}
      <div className="rounded border p-4 text-sm">
        <div className="text-muted-foreground">ID: {p.id}</div>
      </div>
    </div>
  );
}
