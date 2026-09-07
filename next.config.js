/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" }, // provider-hosted image/video result URLs
    ],
  },
};

module.exports = nextConfig;
