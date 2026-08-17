import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import SetCard from "@/components/SetCard";
import { getFeaturedSets, getThemes } from "@/lib/queries";

export default async function HomePage() {
  const [featured, themes] = await Promise.all([getFeaturedSets(8), getThemes()]);
  const topThemes = [...themes].sort((a, b) => b.setCount - a.setCount).slice(0, 6);

  return (
    <div className="mx-auto max-w-6xl px-4 md:px-6">
      {/* Hero */}
      <section className="px-2 py-10 text-center md:py-14">
        <h1 className="mx-auto mb-2.5 max-w-[18ch] font-display text-[clamp(24px,4vw,38px)] font-extrabold leading-tight tracking-tight text-balance">
          Compara el precio de cualquier set LEGO
        </h1>
        <p className="mx-auto mb-6 max-w-[46ch] text-[15px] text-muted">
          Todas las tiendas, un solo sitio. Precios actualizados a diario y aviso del mínimo histórico.
        </p>
        <SearchBar variant="hero" placeholder="Millennium Falcon, 75192, Botanicals…" />
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {topThemes.map((t) => (
            <Link
              key={t.id}
              href={`/tema/${t.slug}`}
              className="rounded-full border border-line bg-surface px-3.5 py-1.5 text-[12.5px] text-muted transition-colors hover:border-brick hover:text-brick"
            >
              {t.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Ofertas destacadas */}
      <section className="pb-6">
        <div className="mb-3 flex items-center justify-between px-1">
          <h2 className="text-[15px] font-extrabold">Sets destacados</h2>
          <Link href="/tematicas" className="text-[12.5px] text-stud hover:underline">
            Ver por temáticas →
          </Link>
        </div>
        {featured.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((set) => (
              <SetCard key={set.id} set={set} />
            ))}
          </div>
        ) : (
          <p className="rounded-xl2 border border-line bg-surface p-6 text-center text-sm text-muted">
            Aún no hay sets cargados. Ejecuta <code className="font-mono">npm run db:seed</code>.
          </p>
        )}
      </section>
    </div>
  );
}
