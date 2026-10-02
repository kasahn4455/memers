/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next 16 uses Turbopack by default. Empty config silences the
  // "webpack config with no turbopack config" error. Solana libs
  // don't need the fs/os/path/crypto shims under Turbopack.
  turbopack: {},

  // Kept for `next build --webpack` / webpack fallback so Solana
  // libs don't try to resolve Node core modules in the browser.
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      os: false,
      path: false,
      crypto: false,
    };
    return config;
  },
};

module.exports = nextConfig;
