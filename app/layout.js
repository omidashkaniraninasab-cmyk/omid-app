import './globals.css'
import Header from '@/components/Header'

export const metadata = {
  title: 'Omid App',
  description: 'سیستم احراز هویت حرفه‌ای',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <Header />
        {children}
      </body>
    </html>
  )
}