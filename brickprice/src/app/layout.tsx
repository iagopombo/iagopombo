import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import { getThemes } from "@/lib/queries";

export const metadata: Metadata = {
  title: {
    default: "BrickPrice — Compara precios de sets LEGO",
    template: "%s · BrickPrice",
  },
  description:
    "Compara el precio de cualquier set LEGO en todas las tiendas. Buscador exacto, navegación por temáticas y mejores ofertas.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const themes = await getThemes();

  return (
    <html lang="es">
      <body className="min-h-screen font-body">
        <Header themes={themes} />
        <main>{children}</main>
        <footer className="mt-10 border-t border-line px-6 py-8 text-center text-xs text-faint">
          <p>
            BrickPrice · Comparador de precios de sets LEGO ·{" "}
            <span className="whitespace-nowrap">Fase 1 (catálogo)</span>
          </p>
          <p className="mt-1">
            Proyecto no afiliado a LEGO Group. LEGO® es una marca registrada de su propietario.
          </p>
        </footer>
      </body>
    </html>
  );
}
