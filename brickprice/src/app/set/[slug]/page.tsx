import Link from "next/link";
import { notFound } from "next/navigation";
import BrickImage from "@/components/BrickImage";
import { getSetBySlug } from "@/lib/queries";
import { formatEuro, formatNumber, relativeDay } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  return { title: set ? `${set.name} (${set.setNumber})` : "Set" };
}

const stockLabel: Record<string, { text: string; cls: string }> = {
  in: { text: "En stock", cls: "bg-leaf-soft text-leaf" },
  low: { text: "Pocas uds.", cls: "bg-[color-mix(in_srgb,var(--sun)_18%,transparent)] text-[var(--sun)]" },
  out: { text: "Agotado", cls: "bg-surface-2 text-faint" },
};

export default async function SetPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const set = await getSetBySlug(slug);
  if (!set) notFound();

  const offers = set.offers.filter((o) => o.price > 0);
  const best = offers[0] ?? null; // vienen ordenadas por precio asc
  const saving =
    best && set.rrp && set.rrp > best.price ? set.rrp - best.price : null;
  const savingPct =
    saving && set.rrp ? Math.round((saving / set.rrp) * 100) : null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 md:px-6">
      <nav className="mb-4 font-mono text-[12px] text-faint">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        ›{" "}
        <Link href={`/tema/${set.theme.slug}`} className="hover:underline">
          {set.theme.name}
        </Link>{" "}
        ›{" "}
        <span className="text-muted">
          {set.setNumber} {set.name}
        </span>
      </nav>

      <div className="grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Media */}
        <div className="flex flex-col gap-2.5">
          <div className="aspect-square overflow-hidden rounded-xl2 border border-line">
            <BrickImage color={set.theme.color} label={`Set ${set.setNumber}`} src={set.image} />
          </div>
          <div className="flex flex-wrap gap-2">
            {set.pieces ? (
              <span className="rounded-md border border-line-soft bg-surface-2 px-2 py-1 font-mono text-[11.5px] text-muted">
                {formatNumber(set.pieces)} piezas
              </span>
            ) : null}
            {set.year ? (
              <span className="rounded-md border border-line-soft bg-surface-2 px-2 py-1 font-mono text-[11.5px] text-muted">
                {set.year}
              </span>
            ) : null}
            <span className="rounded-md border border-line-soft bg-surface-2 px-2 py-1 font-mono text-[11.5px] text-muted">
              {set.theme.name}
            </span>
          </div>
        </div>

        {/* Info + precios */}
        <div>
          <h1 className="font-display text-2xl font-extrabold tracking-tight">{set.name}</h1>
          <p className="mb-4 text-[13px] text-muted">
            Set {set.setNumber}
            {set.rrp ? ` · PVP recomendado ${formatEuro(set.rrp)}` : ""}
          </p>

          {best ? (
            <>
              <div className="mb-4 flex items-center justify-between gap-3 rounded-xl2 border border-[color-mix(in_srgb,var(--leaf)_35%,transparent)] bg-leaf-soft px-4 py-3">
                <div>
                  <div className="font-mono text-[12px] font-bold uppercase tracking-wide text-leaf">
                    Mejor precio ahora
                  </div>
                  <div className="font-mono text-2xl font-extrabold tabular-nums text-ink">
                    {formatEuro(best.price)}
                  </div>
                </div>
                {saving ? (
                  <div className="text-right text-[12.5px] text-muted">
                    Ahorras <b className="text-ink">{formatEuro(saving)}</b>
                    {savingPct ? ` (−${savingPct}%)` : ""}
                    <br />
                    frente al PVP
                  </div>
                ) : null}
              </div>

              <div className="overflow-x-auto rounded-xl2 border border-line bg-surface">
                <table className="w-full text-[13.5px]">
                  <thead>
                    <tr className="border-b border-line text-left font-mono text-[11px] uppercase tracking-wide text-faint">
                      <th className="px-3 py-2.5 font-semibold">Tienda</th>
                      <th className="px-3 py-2.5 font-semibold">Precio</th>
                      <th className="px-3 py-2.5 font-semibold">Envío</th>
                      <th className="px-3 py-2.5 font-semibold">Stock</th>
                      <th className="px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((o, i) => {
                      const st = stockLabel[o.stock] ?? stockLabel.in;
                      const isBest = i === 0;
                      return (
                        <tr
                          key={o.store.name}
                          className={`border-b border-line-soft last:border-0 ${
                            isBest ? "bg-leaf-soft" : ""
                          }`}
                        >
                          <td className="px-3 py-3">
                            <div className="font-bold">{o.store.name}</div>
                            <div className="text-[11px] text-faint">
                              Actualizado {relativeDay(new Date(o.updatedAt))}
                            </div>
                          </td>
                          <td
                            className={`px-3 py-3 font-mono text-[15px] font-extrabold tabular-nums ${
                              isBest ? "text-leaf" : ""
                            }`}
                          >
                            {formatEuro(o.price)}
                          </td>
                          <td className="px-3 py-3 text-muted">
                            {o.shipping > 0 ? formatEuro(o.shipping) : "Gratis"}
                          </td>
                          <td className="px-3 py-3">
                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${st.cls}`}>
                              {st.text}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-right">
                            <span
                              className={`inline-block whitespace-nowrap rounded-lg px-2.5 py-1.5 text-[12px] font-bold ${
                                isBest
                                  ? "bg-brick text-white shadow-[inset_0_-2px_0_rgba(0,0,0,.16)]"
                                  : "border border-[color-mix(in_srgb,var(--stud)_40%,var(--line))] text-stud"
                              }`}
                            >
                              Ir a la tienda →
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-[11.5px] text-faint">
                Precios de ejemplo (Fase 1). En la Fase 2 se conectan las tiendas reales vía feeds de
                afiliación y los botones enlazarán con cada oferta.
              </p>
            </>
          ) : (
            <div className="rounded-xl2 border border-dashed border-line bg-surface-2 p-6 text-center">
              <p className="mb-1 font-semibold">Comparación de precios: próximamente</p>
              <p className="text-sm text-muted">
                La conexión con las tiendas llega en la Fase 2. De momento ya puedes navegar todo el
                catálogo por temáticas y buscar cualquier set.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
