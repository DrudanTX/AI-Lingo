import type { Metadata } from 'next';
import './globals.css';
import { AppShell } from '../components/app-shell';
export const metadata: Metadata = { title: 'AI Lingo — Learn the language of AI', description: 'AI education for curious minds' };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="en"><body><AppShell>{children}</AppShell></body></html> }
