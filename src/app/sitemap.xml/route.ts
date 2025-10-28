import { listProducts } from "@/lib/db";

export async function GET(){
  const site = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const urls = [
    "", "catalog", "services", "projects", "guide", "samples"
  ];
  const prods = await listProducts();
  const prodUrls = prods.map(p=>`<url><loc>${site}/product/${p.id}</loc><changefreq>weekly</changefreq></url>`).join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${urls.map(u=>`<url><loc>${site}/${u}</loc><changefreq>weekly</changefreq></url>`).join("")}
    ${prodUrls}
  </urlset>`;

  return new Response(body, { headers: { "Content-Type": "application/xml; charset=utf-8" } });
}
