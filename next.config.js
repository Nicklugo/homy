const { withSentryConfig } = require('@sentry/nextjs');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable compression
  compress: true,
  // Enable image optimization
  images: {
    domains: ['your-image-domain.com'], // Add your image domains here
  },
  // Configure Sentry
  sentry: {
    hideSourceMaps: true,
  },
  // Optimize builds
  swcMinify: true,
  // Configure webpack
  webpack: (config, { dev, isServer }) => {
    // Add optimizations here
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        minSize: 20000,
        maxSize: 244000,
        minChunks: 1,
        maxAsyncRequests: 30,
        maxInitialRequests: 30,
        cacheGroups: {
          defaultVendors: {
            test: /[\\/]node_modules[\\/]/,
            priority: -10,
            reuseExistingChunk: true,
          },
          default: {
            minChunks: 2,
            priority: -20,
            reuseExistingChunk: true,
          },
        },
      };
    }
    return config;
  },
};

// Wrap with bundle analyzer
const configWithBundleAnalyzer = withBundleAnalyzer(nextConfig);

// Export with Sentry configuration
module.exports = withSentryConfig(
  configWithBundleAnalyzer,
  {
    silent: true,
    org: "your-org",
    project: "your-project",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
  }
); 