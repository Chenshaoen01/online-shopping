/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'pub-017e7bcd17494c71890e85da86b88d1a.r2.dev',
            },
        ],
    },
    async rewrites() {
        return [
          {
            source: '/admin-api/:path*',
            destination: 'https://online-shopping-api-wsks.onrender.com/:path*',
          },
        ];
      },
};

export default nextConfig;
