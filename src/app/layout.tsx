import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import '@/shared/styles/common/index.css'
import { cookies } from 'next/headers'

export const metadata: Metadata = {
    title: 'Duel Game',
    description: 'Just game.'
}

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const modeCookie = cookies().get('mode')
    const mode = modeCookie ? modeCookie.value : 'dark'

    return (
        <html lang='en' data-mode={mode}>
            <body>{children}</body>
        </html>
    )
}
