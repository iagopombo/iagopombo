"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import SearchBar from "./SearchBar";

export type ThemeNavItem = {
  id: number;
  name: string;
  slug: string;
  color: string;
  setCount: number;
};

export default function Header({ themes }: { themes: ThemeNavItem[] }) {
  const [open, setOpen] = useState(false);

  // Cierra el panel con Escape y bloquea el scroll del fondo.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 flex items-center gap-3.5 border-b border-line bg-surface px-4 py-3 md:px-6">
        <button
          onClick={() => setOpen(true)}
          aria-label="Abrir menú de temáticas"
          aria-expanded={open}
          className="flex flex-none flex-col gap-[3.5px] p-1"
        >
          <span className="block h-[2.4px] w-5 rounded bg-ink" />
          <span className="block h-[2.4px] w-5 rounded bg-ink" />
          <span className="block h-[2.4px] w-5 rounded bg-ink" />
        </button>

        <Link href="/" className="flex flex-none items-center gap-2 font-display text-base font-extrabold tracking-tight">
          <span className="relative h-5 w-5 rounded-[5px] bg-brick shadow-[inset_0_-2px_0_rgba(0,0,0,.18)]" />
          Brick<span className="text-brick">Price</span>
        </Link>

        <div className="hidden flex-1 sm:flex">
          <SearchBar />
        </div>

        <span className="ml-auto h-[30px] w-[30px] flex-none rounded-full border border-line bg-surface-2 sm:ml-0" />
      </header>

      {/* búsqueda en móvil */}
      <div className="border-b border-line-soft bg-surface px-4 py-2 sm:hidden">
        <SearchBar />
      </div>

      {/* Drawer de temáticas */}
      {open && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/45"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 flex w-[340px] max-w-[82%] flex-col bg-surface shadow-lg2">
            <div className="flex items-center justify-between border-b border-line-soft px-4 py-3.5">
              <b className="font-display text-[15px] font-extrabold">Explora por temática</b>
              <button
                onClick={() => setOpen(false)}
                aria-label="Cerrar menú"
                className="text-lg text-faint"
              >
                ✕
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              {themes.map((t) => (
                <Link
                  key={t.id}
                  href={`/tema/${t.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-surface-2"
                >
                  <span
                    className="h-[22px] w-[22px] flex-none rounded-md shadow-[inset_0_-2px_0_rgba(0,0,0,.15)]"
                    style={{ background: t.color }}
                  />
                  <span className="flex-1 font-semibold">{t.name}</span>
                  <span className="font-mono text-[11.5px] tabular-nums text-faint">{t.setCount}</span>
                  <span className="text-[13px] text-faint">›</span>
                </Link>
              ))}
            </nav>
          </aside>
        </div>
      )}
    </>
  );
}
