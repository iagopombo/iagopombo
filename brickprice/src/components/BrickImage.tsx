type Props = {
  color: string;
  label: string;
  src?: string | null;
  alt?: string;
  className?: string;
};

/**
 * Imagen del set. Si hay foto real la muestra; si no, dibuja un
 * placeholder tipo ladrillo con tacos usando el color de la temática.
 */
export default function BrickImage({ color, label, src, alt, className }: Props) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt ?? label}
        loading="lazy"
        className={`h-full w-full object-cover ${className ?? ""}`}
      />
    );
  }
  return (
    <div
      className={`brick-photo h-full w-full ${className ?? ""}`}
      style={{ ["--bc" as string]: color }}
      role="img"
      aria-label={alt ?? label}
    >
      <span className="rounded-full bg-black/30 px-2 py-0.5 font-mono text-[11px] text-white/95">
        {label}
      </span>
    </div>
  );
}
