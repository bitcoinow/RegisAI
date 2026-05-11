/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Enable server actions for form submissions
    serverActions: {
      bodySizeLimit: '10mb', // Allow PDF uploads up to 10MB
    },
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default nextConfig;
