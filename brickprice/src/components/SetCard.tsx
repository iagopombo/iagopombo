import Link from "next/link";
import BrickImage from "./BrickImage";
import type { SetWithPrice } from "@/lib/queries";
import { formatEuro } from "@/lib/format";

export default function SetCard({ set }: { set: SetWithPrice }) {
  return (
    <Link
      href={`/set/${set.slug}`}
      className="group flex flex-col gap-2 rounded-xl2 border border-line bg-surface p-2.5 shadow-card transition-transform hover:-translate-y-0.5"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-lg">
        <BrickImage color={set.theme.color} label={set.setNumber} src={set.image} />
      </div>
      <div className="font-mono text-[11px] text-faint">
        {set.setNumber} · {set.theme.name}
      </div>
      <div className="text-[13.5px] font-bold leading-tight text-ink group-hover:text-brick">
        {set.name}
      </div>

      <div className="mt-auto flex flex-col gap-1 pt-1">
        {set.discountPct ? (
          <span className="self-start rounded-full bg-leaf-soft px-2 py-0.5 text-[11px] font-bold text-leaf">
            −{set.discountPct}%
          </span>
        ) : null}
        {set.bestPrice !== null ? (
          <>
            <div className="flex items-baseline gap-1.5">
              <b className="font-mono text-[17px] font-extrabold tabular-nums text-ink">
                {formatEuro(set.bestPrice)}
              </b>
              {set.rrp && set.rrp > set.bestPrice ? (
                <s className="text-[12px] text-faint">{formatEuro(set.rrp)}</s>
              ) : null}
            </div>
            <div className="text-[11.5px] text-muted">
              {set.offerCount > 1
                ? `Mejor: ${set.bestStore} · ${set.offerCount} tiendas`
                : set.bestStore}
            </div>
          </>
        ) : (
          <div className="text-[11.5px] text-faint">Precios próximamente</div>
        )}
      </div>
    </Link>
  );
}
