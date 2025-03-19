/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'plus.unsplash.com', 'placekitten.com'],
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        unoptimized: true,
    },
    reactStrictMode: true,
    swcMinify: true,
    output: 'export',
    basePath: process.env.NODE_ENV === 'production' ? '/photo-gallery' : '',
    trailingSlash: true,
    assetPrefix: process.env.NODE_ENV === 'production' ? '/photo-gallery/' : '',
};

module.exports = nextConfig;
