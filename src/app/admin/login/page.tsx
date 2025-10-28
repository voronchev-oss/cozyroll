// src/app/admin/login/page.tsx
export const dynamic = "force-dynamic"; // чтобы страница не кешировалась
export const revalidate = 0;

export default function AdminLoginPage() {
  return (
    <section className="max-w-md mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Вход в админку</h1>

      <form action="/api/auth/login" method="post" className="space-y-4">
        <div>
          <label className="block text-sm mb-1" htmlFor="email">E-mail</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="admin@cozyroll.ru"
          />
        </div>

        <div>
          <label className="block text-sm mb-1" htmlFor="password">Пароль</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full border rounded px-3 py-2"
            placeholder="••••••••"
          />
        </div>

        <button type="submit" className="btn btn-primary px-4 py-2 rounded bg-blue-600 text-white">
          Войти
        </button>
      </form>
    </section>
  );
}
