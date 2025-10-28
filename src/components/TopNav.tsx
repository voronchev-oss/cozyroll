"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/catalog", label: "Каталог" },
  { href: "/services", label: "Услуги" },
  { href: "/projects", label: "Проекты" },
  { href: "/guide", label: "Гид" },
];

export default function TopNav(){
  const p = usePathname();
  return (
    <header className="border-b border-black/10 sticky top-0 z-50 bg-white/80 backdrop-blur">
      <div className="container h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">CozyRoll</Link>
        <nav className="hidden sm:flex gap-2">
          {links.map(l=>(
            <Link key={l.href} href={l.href} className={`btn-ghost ${p?.startsWith(l.href)?"bg-black/5":""}`}>{l.label}</Link>
          ))}
          <Link href="/admin/login" className="btn-ghost">Кабинет</Link>
        </nav>
      </div>
    </header>
  );
}
