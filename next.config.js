/** @type {import('next').NextConfig} */
const nextConfig = {
  // @consumet/extensions and friends use dynamic require / CJS-only deps
  // (got-scraping, cheerio, axios). Don't let webpack bundle them — load
  // them from node_modules at runtime.
  serverExternalPackages: ["@consumet/extensions", "got-scraping"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

module.exports = nextConfig;
