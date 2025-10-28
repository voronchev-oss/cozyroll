// всегда динамически, чтобы ловить изменения формы без кеша
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function AdminLoginPage() {
  return (
    <section className="py-10 max-w-md mx-auto">
      <h1 className="h2 mb-6">Вход в админку</h1>

      <form action="/api/admin/login" method="POST" className="card card-pad grid gap-4">
        <label className="grid gap-1">
          <span className="text-sm">E-mail</span>
          <input
            type="email"
            name="email"
            required
            className="border rounded-md px-3 py-2"
            placeholder="admin@cozyroll.ru"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Пароль</span>
          <input
            type="password"
            name="password"
            required
            className="border rounded-md px-3 py-2"
            placeholder="••••••••"
          />
        </label>

        <button className="btn">Войти</button>
      </form>
    </section>
  );
}
