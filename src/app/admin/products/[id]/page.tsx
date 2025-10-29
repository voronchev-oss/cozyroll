// src/app/admin/products/[id]/page.tsx
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const revalidate = 0;

export default async function AdminProductIdRedirect({
  params,
}: {
  // В Next 16 params — это Promise
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // обязательно дождаться!
  redirect(`/admin/products/${encodeURIComponent(id)}/edit`);
}
