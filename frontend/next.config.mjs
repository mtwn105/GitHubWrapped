/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "api.producthunt.com",
        pathname: "**",
      },
    ],
  },
  // ... other existing config
};

export default nextConfig;
