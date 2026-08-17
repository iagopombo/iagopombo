/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Brickset y otras fuentes de imágenes de sets (Fase 2)
      { protocol: "https", hostname: "images.brickset.com" },
      { protocol: "https", hostname: "**.rebrickable.com" },
    ],
  },
};

export default nextConfig;
