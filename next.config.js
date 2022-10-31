/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: '/',
  images : {unoptimized : true},
}

module.exports = nextConfig
