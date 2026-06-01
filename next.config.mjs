import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Next doesn't infer it from a stray parent lockfile.
  turbopack: {
    root: __dirname,
  },
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
