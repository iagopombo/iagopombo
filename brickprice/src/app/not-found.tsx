import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <div className="mx-auto mb-5 h-12 w-12 rounded-lg bg-brick shadow-[inset_0_-4px_0_rgba(0,0,0,.18)]" />
      <h1 className="mb-2 font-display text-2xl font-extrabold">No encontramos esa pieza</h1>
      <p className="mb-6 text-muted">
        La página o el set que buscas no existe (todavía).
      </p>
      <Link
        href="/"
        className="inline-block rounded-full bg-brick px-6 py-3 text-sm font-bold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,.16)]"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
