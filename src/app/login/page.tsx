import { login } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white border border-gray-100 shadow-sm rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-900 text-center">Acceso Administrador</h1>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Ingresa tus credenciales para gestionar las promociones.
          </p>

          <form action={login} className="mt-6 space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Usuario
              </label>
              <input
                id="username"
                name="username"
                required
                placeholder="admin"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="••••••••"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Ingresar
            </button>
          </form>

          <div className="mt-4 text-center">
            <a href="/" className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-4">
              ← Volver al inicio
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
