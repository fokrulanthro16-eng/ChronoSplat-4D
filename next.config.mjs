/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Prevents dual-canvas mount in WebXR dev loops
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(splat|ply|wasm)$/,
      type: 'asset/resource',
    });
    return config;
  },
  headers: async () => [
    {
      source: '/:path*',
      headers: [
        { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
        { key: 'Cross-Origin-Embedder-Policy', value: 'require-corp' },
      ],
    },
  ],
};

export default nextConfig;
