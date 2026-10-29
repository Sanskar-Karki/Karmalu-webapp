/** @type {import('next').NextConfig} */
const nextConfig = {
  // Lets a production build run (e.g. NEXT_DIST_DIR=.next-build) without
  // clobbering the running dev server's .next folder.
  distDir: process.env.NEXT_DIST_DIR || ".next",

  images: {
    qualities: [85, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        // Admin uploads (photos & videos) are stored on Cloudinary
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [360, 480, 640, 768, 1024, 1280, 1536, 1920, 2048, 2400],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year — optimized images are content-addressed by URL+params
  },

  async redirects() {
    return [
      { source: "/admin/home", destination: "/admin/new-arrivals", permanent: true },
      { source: "/originals/product/essential-training-tee", destination: "/originals/product/essential-tee", permanent: true },
      { source: "/originals/product/performance-quarter-zip", destination: "/originals/product/everyday-quarter-zip", permanent: true },
      { source: "/originals/product/training-shorts-men", destination: "/originals/product/everyday-shorts", permanent: true },
      { source: "/originals/product/zen-flow-legging", destination: "/originals/product/high-rise-everyday-legging", permanent: true },
      { source: "/originals/product/sculpt-sports-bra", destination: "/originals/product/sculpt-bra", permanent: true },
      { source: "/originals/product/studio-crop-hoodie", destination: "/originals/product/cropped-everyday-hoodie", permanent: true },
      { source: "/originals/product/flow-shorts-women", destination: "/originals/product/biker-shorts", permanent: true },
      { source: "/originals/product/performance-water-bottle", destination: "/originals/product/everyday-canvas-tote", permanent: true },
      { source: "/originals/product/sport-crossbody-bag", destination: "/originals/product/everyday-crossbody-bag", permanent: true },
      { source: "/originals/product/grip-training-gloves", destination: "/originals/product/classic-baseball-cap", permanent: true },
      { source: "/originals/product/resistance-band-set", destination: "/originals/product/everyday-leather-belt", permanent: true },
      { source: "/originals/tops", destination: "/originals/tshirt", permanent: true },
      { source: "/originals/bottoms", destination: "/originals/trousers", permanent: true },
      { source: "/originals/outerwear", destination: "/originals/jacket", permanent: true },
      { source: "/originals/men", destination: "/originals/shop", permanent: true },
      { source: "/originals/women", destination: "/originals/shop", permanent: true },
      { source: "/originals/accessories", destination: "/originals/shop", permanent: true },
      { source: "/activewear", destination: "/originals", permanent: true },
      { source: "/activewear/:path*", destination: "/originals/:path*", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },

  // Compress responses
  compress: true,

  // Strict mode for catching React issues early
  reactStrictMode: true,

  // Opt out of sending telemetry
  // env: { NEXT_TELEMETRY_DISABLED: "1" },
};

export default nextConfig;
