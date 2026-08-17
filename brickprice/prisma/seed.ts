import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// --- Temáticas (nombre -> color) ---
const THEMES: Record<string, string> = {
  "Star Wars": "#3a6ea5",
  Technic: "#c8102e",
  Icons: "#6a3d99",
  "Harry Potter": "#9c1f2e",
  Botanicals: "#2e9e5b",
  Marvel: "#e0691a",
  City: "#f4b40b",
  Ideas: "#1273d4",
  "Speed Champions": "#202634",
  Ninjago: "#0aa5a0",
  Friends: "#ea4c89",
};

// --- Sets (datos reales de catálogo; sin precios de tienda) ---
type SeedSet = {
  setNumber: string;
  name: string;
  theme: keyof typeof THEMES | string;
  year: number;
  pieces: number;
  rrp: number;
  featured?: boolean;
};

const SETS: SeedSet[] = [
  // Star Wars
  { setNumber: "75192", name: "Millennium Falcon UCS", theme: "Star Wars", year: 2017, pieces: 7541, rrp: 849.99, featured: true },
  { setNumber: "75257", name: "Halcón Milenario", theme: "Star Wars", year: 2019, pieces: 1351, rrp: 169.99 },
  { setNumber: "75375", name: "Halcón Milenario", theme: "Star Wars", year: 2024, pieces: 921, rrp: 84.99 },
  { setNumber: "75313", name: "AT-AT UCS", theme: "Star Wars", year: 2021, pieces: 6785, rrp: 799.99, featured: true },
  { setNumber: "75367", name: "Crucero de Ataque de la República clase Venator", theme: "Star Wars", year: 2023, pieces: 5374, rrp: 649.99 },
  { setNumber: "75331", name: "The Razor Crest", theme: "Star Wars", year: 2022, pieces: 6187, rrp: 599.99 },
  // Technic
  { setNumber: "42143", name: "Ferrari Daytona SP3", theme: "Technic", year: 2022, pieces: 3778, rrp: 449.99, featured: true },
  { setNumber: "42115", name: "Lamborghini Sián FKP 37", theme: "Technic", year: 2020, pieces: 3696, rrp: 379.99 },
  { setNumber: "42154", name: "Ford GT40", theme: "Technic", year: 2023, pieces: 1466, rrp: 119.99 },
  { setNumber: "42156", name: "PEUGEOT 9X8 24H Le Mans Hybrid Hypercar", theme: "Technic", year: 2023, pieces: 1775, rrp: 199.99 },
  { setNumber: "42151", name: "Bugatti Bolide", theme: "Technic", year: 2022, pieces: 905, rrp: 54.99 },
  // Icons
  { setNumber: "10307", name: "Torre Eiffel", theme: "Icons", year: 2022, pieces: 10001, rrp: 629.99, featured: true },
  { setNumber: "10276", name: "Coliseo", theme: "Icons", year: 2020, pieces: 9036, rrp: 549.99 },
  { setNumber: "10294", name: "Titanic", theme: "Icons", year: 2021, pieces: 9090, rrp: 679.99, featured: true },
  { setNumber: "10497", name: "Explorador Galáctico", theme: "Icons", year: 2022, pieces: 1254, rrp: 99.99 },
  // Botanicals
  { setNumber: "10281", name: "Bonsái", theme: "Botanicals", year: 2021, pieces: 878, rrp: 49.99, featured: true },
  { setNumber: "10280", name: "Ramo de flores", theme: "Botanicals", year: 2021, pieces: 756, rrp: 59.99 },
  { setNumber: "10289", name: "Aves del paraíso", theme: "Botanicals", year: 2021, pieces: 1173, rrp: 99.99 },
  { setNumber: "10311", name: "Orquídea", theme: "Botanicals", year: 2022, pieces: 608, rrp: 49.99, featured: true },
  { setNumber: "10309", name: "Suculentas", theme: "Botanicals", year: 2022, pieces: 771, rrp: 49.99 },
  // Harry Potter
  { setNumber: "76405", name: "Expreso de Hogwarts — Edición Coleccionista", theme: "Harry Potter", year: 2022, pieces: 5129, rrp: 499.99, featured: true },
  { setNumber: "71043", name: "Castillo de Hogwarts", theme: "Harry Potter", year: 2018, pieces: 6020, rrp: 469.99, featured: true },
  { setNumber: "76419", name: "Castillo y Terrenos de Hogwarts", theme: "Harry Potter", year: 2023, pieces: 2660, rrp: 169.99 },
  // Marvel
  { setNumber: "76269", name: "Torre de los Vengadores", theme: "Marvel", year: 2023, pieces: 5201, rrp: 499.99, featured: true },
  { setNumber: "76178", name: "Daily Bugle", theme: "Marvel", year: 2021, pieces: 3772, rrp: 299.99 },
  { setNumber: "76210", name: "Hulkbuster", theme: "Marvel", year: 2022, pieces: 4049, rrp: 549.99 },
  // City
  { setNumber: "60198", name: "Tren de Mercancías", theme: "City", year: 2018, pieces: 1226, rrp: 229.99 },
  { setNumber: "60337", name: "Tren de Pasajeros de Alta Velocidad", theme: "City", year: 2022, pieces: 764, rrp: 139.99, featured: true },
  { setNumber: "60380", name: "Centro Urbano", theme: "City", year: 2023, pieces: 2010, rrp: 199.99 },
  // Ideas
  { setNumber: "21318", name: "Casa del Árbol", theme: "Ideas", year: 2019, pieces: 3036, rrp: 199.99, featured: true },
  { setNumber: "21058", name: "Gran Pirámide de Guiza", theme: "Ideas", year: 2022, pieces: 1476, rrp: 129.99 },
  { setNumber: "21344", name: "El Orient Express", theme: "Ideas", year: 2024, pieces: 2540, rrp: 299.99, featured: true },
  // Speed Champions
  { setNumber: "76917", name: "Nissan Skyline GT-R (R34) — 2 Fast 2 Furious", theme: "Speed Champions", year: 2023, pieces: 319, rrp: 24.99 },
  { setNumber: "76914", name: "Ferrari 812 Competizione", theme: "Speed Champions", year: 2023, pieces: 261, rrp: 22.99 },
  // Ninjago
  { setNumber: "71799", name: "Ciudad de NINJAGO — Mercados", theme: "Ninjago", year: 2023, pieces: 5685, rrp: 369.99, featured: true },
  // Friends
  { setNumber: "41732", name: "Tienda de Diseño de Interiores", theme: "Friends", year: 2023, pieces: 834, rrp: 49.99 },
];

// --- Tiendas de ejemplo (Fase 1) ---
const STORES = [
  { name: "El Corte Inglés", slug: "el-corte-ingles", affiliateNetwork: "awin" },
  { name: "Amazon", slug: "amazon", affiliateNetwork: "amazon" },
  { name: "PcComponentes", slug: "pccomponentes", affiliateNetwork: "awin" },
  { name: "Fnac", slug: "fnac", affiliateNetwork: "awin" },
  { name: "LEGO Store", slug: "lego-store", affiliateNetwork: null as string | null },
];

/** Genera ofertas de ejemplo para un set a partir de su PVP. */
function demoOffers(rrp: number, setNumber: string) {
  // Pequeña variación por set para que los descuentos no sean todos iguales.
  const seed = Number(setNumber.replace(/\D/g, "")) % 10; // 0..9
  const best = 0.78 + seed * 0.015; // mejor factor ~0.78 – 0.92
  const factors = [best, best + 0.05, best + 0.09, best + 0.13];
  // Las 4 tiendas de retail rotan según el set; LEGO Store va siempre al final, al PVP.
  const retail = STORES.filter((s) => s.slug !== "lego-store");
  const shift = seed % retail.length;
  const rotated = [...retail.slice(shift), ...retail.slice(0, shift)];
  const legoStore = STORES.find((s) => s.slug === "lego-store")!;

  const shippings = [0, 0, 0, 3.99];
  const stocks = ["in", "in", "low", "in"];
  const round = (n: number) => Math.round(n) - 0.01; // termina en ,99

  const offers = rotated.map((store, i) => ({
    storeSlug: store.slug,
    price: Math.max(4.99, round(rrp * Math.min(factors[i], 1))),
    shipping: shippings[i],
    stock: stocks[i],
  }));
  offers.push({ storeSlug: legoStore.slug, price: round(rrp), shipping: 0, stock: "in" });
  return offers;
}

async function main() {
  console.log("🧹 Limpiando base de datos…");
  await prisma.priceHistory.deleteMany();
  await prisma.offer.deleteMany();
  await prisma.set.deleteMany();
  await prisma.store.deleteMany();
  await prisma.theme.deleteMany();

  console.log("🎨 Creando temáticas…");
  const themeId = new Map<string, number>();
  for (const [name, color] of Object.entries(THEMES)) {
    const t = await prisma.theme.create({
      data: { name, slug: slugify(name), color },
    });
    themeId.set(name, t.id);
  }

  console.log("🏬 Creando tiendas…");
  const storeId = new Map<string, number>();
  for (const s of STORES) {
    const st = await prisma.store.create({ data: s });
    storeId.set(s.slug, st.id);
  }

  console.log(`🧱 Creando ${SETS.length} sets…`);
  let offerCount = 0;
  for (const s of SETS) {
    const set = await prisma.set.create({
      data: {
        setNumber: s.setNumber,
        name: s.name,
        slug: `${s.setNumber}-${slugify(s.name)}`,
        year: s.year,
        pieces: s.pieces,
        rrp: s.rrp,
        featured: s.featured ?? false,
        themeId: themeId.get(s.theme as string)!,
      },
    });

    // Ofertas de ejemplo solo para los destacados (para ver la ficha completa).
    if (s.featured) {
      for (const o of demoOffers(s.rrp, s.setNumber)) {
        await prisma.offer.create({
          data: {
            setId: set.id,
            storeId: storeId.get(o.storeSlug)!,
            price: o.price,
            shipping: o.shipping,
            stock: o.stock,
            affiliateUrl: null,
          },
        });
        offerCount++;
      }
    }
  }

  console.log(
    `✅ Listo: ${Object.keys(THEMES).length} temáticas, ${SETS.length} sets, ${offerCount} ofertas de ejemplo.`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
