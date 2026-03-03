// app/layout.tsx
import './globals.css';
import Link from 'next/link';

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
        <body className="bg-gray-50 text-gray-800 min-h-screen">
        <nav className="bg-white shadow-sm p-4 mb-6 flex justify-between items-center max-w-5xl mx-auto rounded-b-md">
            <div className="font-bold text-xl tracking-tight">GatherPOS</div>
            <div className="space-x-4 text-sm font-medium">
                <Link href="/pos" className="hover:text-blue-600">POS System</Link>
                <Link href="/products" className="hover:text-blue-600">Products</Link>
                <Link href="/orders" className="hover:text-blue-600">Orders</Link>
                <Link href="/login" className="text-gray-400 hover:text-red-500">Logout</Link>
            </div>
        </nav>
        <main className="max-w-5xl mx-auto p-4">{children}</main>
        </body>
        </html>
    );
}