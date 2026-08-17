"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const SearchIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4-4" strokeLinecap="round" />
  </svg>
);

type Props = {
  variant?: "bar" | "hero";
  defaultValue?: string;
  placeholder?: string;
};

export default function SearchBar({
  variant = "bar",
  defaultValue = "",
  placeholder = "Busca por nombre o número de set…",
}: Props) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = value.trim();
    if (q) router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  if (variant === "hero") {
    return (
      <form onSubmit={submit} className="mx-auto flex max-w-xl gap-2">
        <div className="flex flex-1 items-center gap-2.5 rounded-full border-2 border-line bg-surface px-5 py-3">
          <SearchIcon className="h-[18px] w-[18px] flex-none text-faint" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            aria-label="Buscar set de LEGO"
            className="w-full bg-transparent text-[14.5px] text-ink outline-none placeholder:text-faint"
          />
        </div>
        <button
          type="submit"
          className="rounded-full bg-brick px-6 py-3 text-sm font-bold text-white shadow-[inset_0_-3px_0_rgba(0,0,0,.16)]"
        >
          Buscar
        </button>
      </form>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="flex flex-1 items-center gap-2 rounded-full border border-line bg-surface-2 px-3.5 py-1.5"
    >
      <SearchIcon className="h-[15px] w-[15px] flex-none text-faint" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar set de LEGO"
        className="w-full bg-transparent text-[13px] text-ink outline-none placeholder:text-faint"
      />
    </form>
  );
}
