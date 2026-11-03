/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  transpilePackages: ["@repo/rules", "@repo/ui"],
};

export default nextConfig;
