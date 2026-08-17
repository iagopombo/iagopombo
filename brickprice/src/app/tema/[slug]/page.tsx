import Link from "next/link";
import { notFound } from "next/navigation";
import SetCard from "@/components/SetCard";
import { getSetsByThemeSlug } from "@/lib/queries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getSetsByThemeSlug(slug);
  return { title: data?.theme.name ?? "Temática" };
}

export default async function ThemePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getSetsByThemeSlug(slug);
  if (!data) notFound();

  const { theme, sets } = data;

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 md:px-6">
      <nav className="mb-3 font-mono text-[12px] text-faint">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        ›{" "}
        <Link href="/tematicas" className="hover:underline">
          Temáticas
        </Link>{" "}
        › <span className="text-muted">{theme.name}</span>
      </nav>

      <div className="mb-5 flex items-center gap-3">
        <span
          className="h-8 w-8 flex-none rounded-lg shadow-[inset_0_-3px_0_rgba(0,0,0,.15)]"
          style={{ background: theme.color }}
        />
        <h1 className="font-display text-2xl font-extrabold tracking-tight">{theme.name}</h1>
        <span className="font-mono text-[12.5px] text-faint">{sets.length} sets</span>
      </div>

      {sets.length ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {sets.map((set) => (
            <SetCard key={set.id} set={set} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">Todavía no hay sets en esta temática.</p>
      )}
    </div>
  );
}
