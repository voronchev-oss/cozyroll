export default function Footer(){
  return (
    <footer className="mt-16 border-t border-black/10">
      <div className="container py-8 text-sm text-[var(--muted)]">
        © {new Date().getFullYear()} CozyRoll — ковролин и ковры.
      </div>
    </footer>
  );
}
