/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      // Preserve URLs from the old CRA routes that used camelCase paths.
      // The new app uses lowercase, but external links shouldn't 404.
      { source: "/aboutUs", destination: "/about", permanent: true },
      { source: "/contactUs", destination: "/contact", permanent: true },
    ];
  },
};

module.exports = nextConfig;
