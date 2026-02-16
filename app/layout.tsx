import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '2026 丙午马年 · 赛博开运钟',
  description: '敲响新年金钟，积攒万福金安',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
