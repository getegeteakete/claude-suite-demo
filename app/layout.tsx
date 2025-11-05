import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'CLAUDE SUITE - クラウド型顧客管理AIシステム',
  description: '合同会社UMAが提供するClaude AI搭載の顧客管理システム',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}

