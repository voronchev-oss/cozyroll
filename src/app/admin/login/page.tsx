// src/app/admin/login/page.tsx
export const dynamic = "force-dynamic"; // не кешируем
export const revalidate = 0;

export default function AdminLoginPage() {
  return (
    <main className="mx-auto max-w-md px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Вход в админку</h1>
      <form method="POST" action="/api/auth/login" className="space-y-4">
        <div>
          <label className="block text-sm mb-1">E-mail</label>
          <input
            name="email"
            type="email"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="admin@cozyroll.ru"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Пароль</label>
          <input
            name="password"
            type="password"
            required
            className="w-full rounded border px-3 py-2"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Войти
        </button>
      </form>
    </main>
  );
}
