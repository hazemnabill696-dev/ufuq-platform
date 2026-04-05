/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/ufuq-platform',
  images: {
    formats: ["image/webp", "image/avif"],
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default nextConfig;
