/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false, // Fully disables Dev Tools UI
  images: {
      remotePatterns: [
        {
          protocol: "https",
          hostname: "example.com",
          pathname: "/images/**",
        },
      ],
  },
};

export default nextConfig;
