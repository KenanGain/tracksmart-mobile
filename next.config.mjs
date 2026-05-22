/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // This app is a mobile-only view. There is no desktop/tablet layout by design.
  // Keep the surface area small: the UI is built inside a phone-width shell.
  poweredByHeader: false,
};

export default nextConfig;
