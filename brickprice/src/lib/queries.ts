import { prisma } from "./db";

export type SetWithPrice = {
  id: number;
  setNumber: string;
  name: string;
  slug: string;
  year: number | null;
  pieces: number | null;
  image: string | null;
  rrp: number | null;
  theme: { name: string; slug: string; color: string };
  bestPrice: number | null;
  bestStore: string | null;
  offerCount: number;
  discountPct: number | null;
};

type SetRow = {
  id: number;
  setNumber: string;
  name: string;
  slug: string;
  year: number | null;
  pieces: number | null;
  image: string | null;
  rrp: number | null;
  theme: { name: string; slug: string; color: string };
  offers: { price: number; store: { name: string } }[];
};

/** Calcula mejor precio, tienda y descuento frente al RRP a partir de las ofertas. */
function withBestPrice(set: SetRow): SetWithPrice {
  const inStock = set.offers.filter((o) => o.price > 0);
  const best = inStock.length
    ? inStock.reduce((a, b) => (a.price <= b.price ? a : b))
    : null;
  const bestPrice = best?.price ?? null;
  const discountPct =
    bestPrice && set.rrp && set.rrp > bestPrice
      ? Math.round((1 - bestPrice / set.rrp) * 100)
      : null;
  return {
    id: set.id,
    setNumber: set.setNumber,
    name: set.name,
    slug: set.slug,
    year: set.year,
    pieces: set.pieces,
    image: set.image,
    rrp: set.rrp,
    theme: set.theme,
    bestPrice,
    bestStore: best?.store.name ?? null,
    offerCount: inStock.length,
    discountPct,
  };
}

const setSelect = {
  id: true,
  setNumber: true,
  name: true,
  slug: true,
  year: true,
  pieces: true,
  image: true,
  rrp: true,
  theme: { select: { name: true, slug: true, color: true } },
  offers: { select: { price: true, store: { select: { name: true } } } },
} as const;

/** Temáticas de primer nivel con su número de sets, para el menú hamburguesa. */
export async function getThemes() {
  const themes = await prisma.theme.findMany({
    where: { parentId: null },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
      _count: { select: { sets: true } },
    },
  });
  return themes.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    color: t.color,
    setCount: t._count.sets,
  }));
}

export async function getFeaturedSets(limit = 8) {
  const sets = await prisma.set.findMany({
    where: { featured: true },
    take: limit,
    orderBy: { name: "asc" },
    select: setSelect,
  });
  return sets.map(withBestPrice);
}

export async function searchSets(query: string) {
  const q = query.trim();
  if (!q) return [];
  const sets = await prisma.set.findMany({
    where: {
      OR: [
        { name: { contains: q } },
        { setNumber: { contains: q } },
        { theme: { name: { contains: q } } },
      ],
    },
    take: 60,
    orderBy: { name: "asc" },
    select: setSelect,
  });
  return sets.map(withBestPrice);
}

export async function getSetsByThemeSlug(slug: string) {
  const theme = await prisma.theme.findUnique({
    where: { slug },
    select: { id: true, name: true, slug: true, color: true },
  });
  if (!theme) return null;
  const sets = await prisma.set.findMany({
    where: { themeId: theme.id },
    orderBy: { name: "asc" },
    select: setSelect,
  });
  return { theme, sets: sets.map(withBestPrice) };
}

export async function getSetBySlug(slug: string) {
  const set = await prisma.set.findUnique({
    where: { slug },
    select: {
      id: true,
      setNumber: true,
      name: true,
      slug: true,
      year: true,
      pieces: true,
      image: true,
      rrp: true,
      theme: { select: { name: true, slug: true, color: true } },
      offers: {
        orderBy: { price: "asc" },
        select: {
          price: true,
          shipping: true,
          stock: true,
          affiliateUrl: true,
          updatedAt: true,
          store: { select: { name: true } },
        },
      },
    },
  });
  return set;
}
