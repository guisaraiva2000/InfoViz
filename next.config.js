/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  assetPrefix: './',
  images : {unoptimized : true},

  /*webpack: (config, { isServer }) => {
    // Fixes npm packages that depend on `fs` module
      config.node = {...config.node,
        fs: 'empty'
      }

    return config
}
*/

}

module.exports = nextConfig
