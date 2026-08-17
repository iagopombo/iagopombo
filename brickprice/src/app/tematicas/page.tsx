import Link from "next/link";
import { getThemes } from "@/lib/queries";

export const metadata = { title: "Temáticas" };

export default async function ThemesPage() {
  const themes = await getThemes();

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <h1 className="mb-4 font-display text-xl font-extrabold">Todas las temáticas</h1>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {themes.map((t) => (
          <Link
            key={t.id}
            href={`/tema/${t.slug}`}
            className="group flex items-center gap-3 rounded-xl2 border border-line bg-surface p-4 shadow-card transition-transform hover:-translate-y-0.5"
          >
            <span
              className="h-9 w-9 flex-none rounded-lg shadow-[inset_0_-3px_0_rgba(0,0,0,.15)]"
              style={{ background: t.color }}
            />
            <span className="min-w-0">
              <span className="block truncate font-bold group-hover:text-brick">{t.name}</span>
              <span className="font-mono text-[11.5px] text-faint">{t.setCount} sets</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
