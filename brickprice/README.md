# 🧱 BrickPrice

Comparador de precios de sets LEGO. **Fase 1: catálogo y navegación.**

Buscador exacto por set, navegación por temáticas (menú hamburguesa al estilo de la
tienda oficial) y ficha de set con la estructura de comparación de precios lista.
Construido con Next.js (App Router) + TypeScript + Tailwind + Prisma.

> Nombre provisional. Proyecto no afiliado a LEGO Group. LEGO® es una marca registrada de su propietario.

---

## Qué incluye la Fase 1

- ✅ App Next.js con renderizado en servidor (SSR) para buen SEO.
- ✅ Modelo de datos completo (Theme, Set, Store, Offer, PriceHistory).
- ✅ Datos de ejemplo: 11 temáticas y ~35 sets reales de LEGO.
- ✅ **Home** con buscador y sets destacados.
- ✅ **Menú hamburguesa** por temáticas.
- ✅ **Resultados de búsqueda** (por nombre, número o temática).
- ✅ **Ficha de set** con tabla comparativa de precios (datos de ejemplo).
- ✅ Script de importación de Brickset listo para la Fase 2.
- ✅ Tema claro/oscuro automático.

La Fase 2 conecta las tiendas reales (Amazon PA-API, Awin) y el cron diario.

---

## Arranque en local

```bash
cd brickprice
npm install
cp .env.example .env      # ya trae DATABASE_URL="file:./dev.db"
npm run db:push           # crea la base de datos SQLite
npm run db:seed           # carga temáticas + sets de ejemplo
npm run dev               # http://localhost:3000
```

Scripts útiles:

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción |
| `npm run db:reset` | Recrea la BD y vuelve a sembrar |
| `npm run import:brickset` | Importa el catálogo real (Fase 2, necesita API key) |

---

## Despliegue en producción (objetivo: antes de octubre)

La app está lista para Vercel + Postgres. Pasos:

1. **Base de datos Postgres** (Neon o Supabase, capa gratuita). Copia su cadena de conexión.
2. En `prisma/schema.prisma`, cambia el `provider` del datasource a `"postgresql"`.
3. En Vercel, importa el repo, con **Root Directory = `brickprice`**.
4. Configura la variable de entorno `DATABASE_URL` con la cadena de Postgres.
5. Despliega. En el primer despliegue, ejecuta las migraciones y el seed
   (`prisma db push` + `npm run db:seed`) contra la BD de producción.

> SQLite es solo para desarrollo local. En Vercel (serverless) hay que usar Postgres.

---

## Estructura

```
brickprice/
├── prisma/
│   ├── schema.prisma      # modelo de datos
│   └── seed.ts            # datos de ejemplo (temáticas + sets)
├── scripts/
│   └── import-brickset.ts # importador del catálogo real (Fase 2)
└── src/
    ├── app/               # páginas (home, buscar, tema, set)
    ├── components/        # Header (menú), SearchBar, SetCard, BrickImage
    └── lib/               # cliente Prisma, consultas, formato
```
