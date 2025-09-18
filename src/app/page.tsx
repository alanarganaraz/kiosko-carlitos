import { getPromotionsToday, type Promotion } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function Home() {
  const promotions = await getPromotionsToday()
  const baDate = new Intl.DateTimeFormat("es-AR", {
    timeZone: "America/Argentina/Buenos_Aires",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date())

  return (
    <main className="min-h-screen bg-gradient-to-br from-background via-card to-background">
      <section className="relative overflow-hidden bg-gradient-to-r from-primary/5 via-secondary/5 to-primary/5 py-16 sm:py-24">
        <div className="absolute inset-0 bg-[url('/abstract-geometric-pattern.png')] opacity-5"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Ofertas actualizadas hoy
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-4">
              <span className="text-primary">Kiosko</span> Carlitos
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground mb-2">Ofertas del día</p>

            <div className="inline-flex items-center gap-2 text-lg font-semibold text-primary bg-primary/10 rounded-full px-6 py-3 mb-8">
              <span>📅</span>
              {baDate}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="https://maps.app.goo.gl/srEVMKkitA274Z9z6"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-card border border-border px-6 py-3 text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-xl">📍</span>
                <span className="font-medium">Cómo llegar</span>
              </a>

              <a
                href="https://wa.me/541120084655"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 rounded-full bg-green-600 px-6 py-3 text-white font-semibold hover:bg-green-700 transition-all duration-200 shadow-sm hover:shadow-md"
              >
                <span className="text-xl">💬</span>
                <span>Consultar por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">🔥 Ofertas de Hoy</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubrí las mejores ofertas que tenemos para vos. Precios increíbles que se renuevan todos los días.
            </p>
          </div>

          {promotions.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl">🛒</span>
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No hay ofertas disponibles</h3>
              <p className="text-muted-foreground mb-6">Volvé más tarde para ver las nuevas ofertas del día.</p>
              <a
                href="https://wa.me/541120084655"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
              >
                <span>💬</span>
                Consultanos por WhatsApp
              </a>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {promotions.map((p: Promotion) => {
                const message = encodeURIComponent(
                  `Hola! Quiero consultar por la promo: ${p.title} - $${p.price.toFixed(2)}`,
                )
                const waLink = `https://wa.me/541120084655?text=${message}`

                return (
                  <article
                    key={p._id}
                    className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded-xl bg-muted border border-border mb-4 relative">
                      {p.imageUrl ? (
                        <img
                          src={p.imageUrl || "/placeholder.svg"}
                          alt={p.title}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                          <span className="text-4xl mb-2">📦</span>
                          <span className="text-sm">Sin imagen</span>
                        </div>
                      )}

                      <div className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
                        OFERTA
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-lg font-semibold text-card-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {p.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold text-primary">${p.price.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">HOY</div>
                      </div>

                      <a
                        href={waLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-green-700 transition-all duration-200 hover:shadow-md"
                        aria-label={`Consultar por ${p.title} en WhatsApp`}
                      >
                        <span>💬</span>
                        Consultar
                      </a>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-card-foreground mb-4">
              ¿Por qué elegir Kiosko Carlitos?
            </h2>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔄</span>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Ofertas Diarias</h3>
              <p className="text-muted-foreground">
                Nuevas promociones todos los días para que siempre encuentres algo especial.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💬</span>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Contacto Directo</h3>
              <p className="text-muted-foreground">Consultá por WhatsApp y resolvé todas tus dudas al instante.</p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="text-lg font-semibold text-card-foreground mb-2">Fácil Ubicación</h3>
              <p className="text-muted-foreground">Te mostramos exactamente cómo llegar a nuestro kiosco.</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
