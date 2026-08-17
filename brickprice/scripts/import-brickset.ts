/**
 * Importa temáticas y sets reales desde la API de Brickset (v3).
 *
 * Uso (Fase 2, cuando tengas la clave):
 *   1. Rellena BRICKSET_API_KEY en .env
 *   2. npm run import:brickset
 *
 * Este script sustituye a los datos de ejemplo del seed por el catálogo real.
 * No trae precios de tienda: eso son los feeds de afiliación (Amazon/Awin).
 *
 * Docs: https://brickset.com/api/v3.asmx
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const API = "https://brickset.com/api/v3.asmx";
const KEY = process.env.BRICKSET_API_KEY;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Color por defecto por temática (se puede afinar a mano después).
const THEME_COLORS: Record<string, string> = {
  "Star Wars": "#3a6ea5",
  Technic: "#c8102e",
  Icons: "#6a3d99",
  "Harry Potter": "#9c1f2e",
  Botanical: "#2e9e5b",
  Marvel: "#e0691a",
  City: "#f4b40b",
  Ideas: "#1273d4",
};
const colorFor = (name: string) => THEME_COLORS[name] ?? "#1273d4";

type BricksetSet = {
  number: string;
  name: string;
  year?: number;
  pieces?: number;
  theme?: string;
  image?: { imageURL?: string };
  LEGOCom?: { US?: { retailPrice?: number }; UK?: { retailPrice?: number } };
};

async function callApi<T>(method: string, body: Record<string, string>): Promise<T> {
  const res = await fetch(`${API}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ apiKey: KEY!, ...body }),
  });
  if (!res.ok) throw new Error(`Brickset ${method}: HTTP ${res.status}`);
  return (await res.json()) as T;
}

async function upsertTheme(name: string): Promise<number> {
  const slug = slugify(name);
  const theme = await prisma.theme.upsert({
    where: { slug },
    update: {},
    create: { name, slug, color: colorFor(name) },
  });
  return theme.id;
}

async function main() {
  if (!KEY) {
    console.error(
      "❌ Falta BRICKSET_API_KEY en .env. Consíguela en https://brickset.com/tools/webservices/requestkey"
    );
    process.exit(1);
  }

  console.log("📥 Descargando sets desde Brickset…");
  const pageSize = 500;
  let page = 1;
  let imported = 0;
  const themeCache = new Map<string, number>();

  // Recorre el catálogo página a página. Ajusta el filtro `params` según necesites
  // (por temática, por año, con precio, etc.).
  for (;;) {
    const data = await callApi<{ status: string; matches: number; sets: BricksetSet[] }>(
      "getSets",
      {
        userHash: "",
        params: JSON.stringify({ pageSize, pageNumber: page, orderBy: "Number" }),
      }
    );

    if (data.status !== "success" || !data.sets?.length) break;

    for (const s of data.sets) {
      if (!s.number || !s.name || !s.theme) continue;
      const themeName = s.theme;
      let themeId = themeCache.get(themeName);
      if (!themeId) {
        themeId = await upsertTheme(themeName);
        themeCache.set(themeName, themeId);
      }
      const setNumber = s.number;
      const rrp = s.LEGOCom?.UK?.retailPrice ?? s.LEGOCom?.US?.retailPrice ?? null;
      await prisma.set.upsert({
        where: { setNumber },
        update: {
          name: s.name,
          year: s.year ?? null,
          pieces: s.pieces ?? null,
          image: s.image?.imageURL ?? null,
          rrp,
          themeId,
        },
        create: {
          setNumber,
          name: s.name,
          slug: `${setNumber}-${slugify(s.name)}`,
          year: s.year ?? null,
          pieces: s.pieces ?? null,
          image: s.image?.imageURL ?? null,
          rrp,
          themeId,
        },
      });
      imported++;
    }

    console.log(`  · página ${page}: ${data.sets.length} sets (acumulado ${imported})`);
    if (data.sets.length < pageSize) break;
    page++;
  }

  console.log(`✅ Importación completada: ${imported} sets, ${themeCache.size} temáticas.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
