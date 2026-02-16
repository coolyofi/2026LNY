import './globals.css'
import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import BlessingPopup from './components/Blessing/BlessingPopup'

export const metadata: Metadata = {
  title: '丙午马年 虔诚祈福',
  description: '一念虔诚，福报自来',
  icons: {
    icon: '/icon.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body>
        {children}
        <BlessingPopup />
        <Analytics />
      </body>
    </html>
  )
}
