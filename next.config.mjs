/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
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
