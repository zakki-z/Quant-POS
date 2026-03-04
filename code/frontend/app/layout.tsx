// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export const metadata = {
    title: 'QuantPOS',
    description: 'A modern point-of-sale system',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
                href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Playfair+Display:wght@500;700;900&display=swap"
                rel="stylesheet"
            />
        </head>
        <body>
        <nav className="sticky top-0 z-40 backdrop-blur-md bg-[var(--bg-base)]/80 border-b border-[var(--border)]">
            <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-[var(--accent)] flex items-center justify-center text-white font-bold text-sm tracking-tight shadow-sm">
                        G
                    </div>
                    <span
                        className="text-lg font-bold tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent)] transition-colors"
                        style={{ fontFamily: 'Playfair Display, serif' }}
                    >
                        QuantPOS
                    </span>
                </Link>
                <div className="flex items-center gap-1">
                    {[
                        { href: '/pos', label: 'POS' },
                        { href: '/products', label: 'Products' },
                        { href: '/orders', label: 'Orders' },
                    ].map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-muted)] transition-all"
                        >
                            {link.label}
                        </Link>
                    ))}
                    <div className="w-px h-5 bg-[var(--border)] mx-2" />
                    <Link
                        href="/login"
                        className="px-3.5 py-2 rounded-lg text-sm font-medium text-[var(--text-muted)] hover:text-[var(--danger)] hover:bg-red-50 transition-all"
                    >
                        Sign Out
                    </Link>
                </div>
            </div>
        </nav>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        </body>
        </html>
    );
}