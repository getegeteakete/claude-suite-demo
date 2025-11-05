/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 既存のデモHTMLファイルと共存させる設定
  async rewrites() {
    return [
      {
        source: '/demo/:path*',
        destination: '/:path*',
      },
    ]
  },
  // デモファイルを静的に提供
  async headers() {
    return [
      {
        source: '/:path*.html',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, must-revalidate',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig

