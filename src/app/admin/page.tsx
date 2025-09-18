import { addPromotion, deletePromotion, getPromotions, logout } from '@/app/actions';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session');
  if (!session) {
    redirect('/login');
  }
  const promotions = await getPromotions();

  // Inline wrappers ensure the action type matches form's expected signature (void | Promise<void>)
  const addPromotionAction = async (formData: FormData): Promise<void> => {
    'use server';
    await addPromotion(formData);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="mx-auto w-full max-w-3xl space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600">Agrega y gestiona las promociones del kiosco.</p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/"
              className="inline-flex text-sm text-blue-600 hover:text-blue-700 underline underline-offset-4"
            >
              ← Volver al inicio
            </Link>
            <form action={async () => { 'use server'; await logout(); }}>
              <button
                type="submit"
                className="inline-flex items-center rounded-md bg-gray-800 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-gray-900"
              >
                Cerrar sesión
              </button>
            </form>
          </div>
        </header>

        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Agregar nueva promoción</h2>
          <form action={addPromotionAction} className="grid gap-4 sm:grid-cols-3">
            <div className="sm:col-span-3">
              <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                URL de imagen (opcional)
              </label>
              <input
                id="imageUrl"
                name="imageUrl"
                placeholder="https://..."
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Pegá un enlace directo a la imagen del producto.</p>
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Título
              </label>
              <input
                id="title"
                name="title"
                required
                placeholder="Ej: 2x1 en gaseosas"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                Precio
              </label>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                required
                placeholder="0.00"
                className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="inline-flex w-full sm:w-auto items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                Agregar promoción
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Promociones actuales</h2>
          {promotions.length === 0 ? (
            <p className="text-gray-500">No hay promociones registradas.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {promotions.map((p) => {
                const deleteAction = async (): Promise<void> => {
                  'use server';
                  await deletePromotion(p._id || '');
                };
                return (
                  <li key={p._id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="font-medium text-gray-900">{p.title}</p>
                      <p className="text-sm text-gray-600">${p.price.toFixed(2)}</p>
                    </div>
                    <form action={deleteAction}>
                      <button
                        type="submit"
                        className="inline-flex items-center rounded-md bg-red-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-red-700"
                      >
                        Eliminar
                      </button>
                    </form>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}
