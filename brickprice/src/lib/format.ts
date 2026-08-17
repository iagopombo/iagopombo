const euro = new Intl.NumberFormat("es-ES", {
  style: "currency",
  currency: "EUR",
});

export function formatEuro(value: number): string {
  return euro.format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("es-ES").format(value);
}

export function relativeDay(date: Date): string {
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "hoy";
  if (days === 1) return "ayer";
  return `hace ${days} días`;
}
