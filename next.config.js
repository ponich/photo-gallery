/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['images.unsplash.com', 'plus.unsplash.com', 'placekitten.com'],
        // Оптимизация для больших изображений
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    },
    // Другие настройки Next.js
    reactStrictMode: true,
    swcMinify: true,
};

module.exports = nextConfig;
