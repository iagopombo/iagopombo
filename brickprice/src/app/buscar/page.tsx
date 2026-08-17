import Link from "next/link";
import SetCard from "@/components/SetCard";
import { searchSets } from "@/lib/queries";

export const metadata = { title: "Buscar" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchSets(query) : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <div className="mb-4 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h1 className="font-display text-xl font-extrabold">
          {query ? (
            <>
              Resultados para <span className="text-brick">«{query}»</span>
            </>
          ) : (
            "Buscar sets"
          )}
        </h1>
        {query ? (
          <span className="font-mono text-[12.5px] text-faint">
            {results.length} {results.length === 1 ? "resultado" : "resultados"}
          </span>
        ) : null}
      </div>

      {!query ? (
        <p className="text-sm text-muted">
          Escribe el nombre o el número de un set en el buscador de arriba.
        </p>
      ) : results.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {results.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl2 border border-line bg-surface p-8 text-center">
          <p className="mb-1 font-semibold">Sin resultados para «{query}»</p>
          <p className="text-sm text-muted">
            Prueba con otro nombre o número de set, o explora{" "}
            <Link href="/tematicas" className="text-stud hover:underline">
              todas las temáticas
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
