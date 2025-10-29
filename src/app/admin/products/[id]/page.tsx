// src/app/admin/products/[id]/page.tsx
import { redirect } from "next/navigation";

export const runtime = "nodejs";
export const revalidate = 0;

export default function AdminProductIdRedirect({
  params,
}: { params: { id: string } }) {
  redirect(`/admin/products/${encodeURIComponent(params.id)}/edit`);
}
