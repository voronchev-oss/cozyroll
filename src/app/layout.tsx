import type { Metadata } from "next";
import "./globals.css";
import TopNav from "../components/TopNav";
import Footer from "../components/Footer";

export const metadata: Metadata = {
  title: { default: "CozyRoll — ковролин и ковры", template: "%s — CozyRoll" },
  description: "Каталог ковролина и ковров. Умные рекомендации, быстрая доставка.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru"><body>
      <TopNav />
      <main className="container">{children}</main>
      <Footer />
    </body></html>
  );
}
