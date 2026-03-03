// app/products/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

type Product = { id: number; name: string; price: number };

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '' });

    // Admin Override Modal State
    const [showOverride, setShowOverride] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
    const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);

    useEffect(() => { loadProducts(); }, []);
    const loadProducts = () => fetchApi('/v1.0/products').then(setProducts).catch(console.error);

    const handleAction = async (action: (token?: string) => Promise<void>) => {
        try {
            await action(); // Try with current token
            loadProducts();
        } catch (err: any) {
            if (err.message === 'FORBIDDEN') {
                setPendingAction(() => action);
                setShowOverride(true);
            } else {
                alert('Action failed');
            }
        }
    };

    const createProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetchApi('/v1.0/products', { method: 'POST', body: JSON.stringify(newProduct) });
        setNewProduct({ name: '', price: '' });
        loadProducts();
    };

    const deleteProduct = (id: number) => handleAction((token) => fetchApi(`/v1.0/products/${id}`, { method: 'DELETE' }, token));

    const executeOverride = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(adminCreds)
            });
            if (!res.ok) throw new Error();
            const { accessToken } = await res.json();

            if (pendingAction) await pendingAction();
            setShowOverride(false);
            setAdminCreds({ username: '', password: '' });
            loadProducts();
        } catch {
            alert('Invalid admin credentials or unauthorized');
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Manage Products</h2>

            <form onSubmit={createProduct} className="flex gap-2 mb-6 border-b pb-6">
                <input className="border p-2 rounded flex-1" placeholder="Name" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                <input className="border p-2 rounded w-32" type="number" step="0.01" placeholder="Price" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} required />
                <button className="bg-blue-600 text-white px-4 rounded">Add</button>
            </form>

            <ul className="space-y-2">
                {products.map(p => (
                    <li key={p.id} className="flex justify-between items-center p-3 bg-gray-50 border rounded">
                        <span>{p.name} - ${p.price.toFixed(2)}</span>
                        <button onClick={() => deleteProduct(p.id)} className="text-red-500 text-sm font-semibold hover:underline">Delete</button>
                    </li>
                ))}
            </ul>

            {/* Admin Override Modal */}
            {showOverride && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
                        <h3 className="font-bold text-red-600 mb-2">Manager Authorization Required</h3>
                        <p className="text-sm text-gray-500 mb-4">This action requires admin privileges.</p>
                        <form onSubmit={executeOverride} className="space-y-3">
                            <input className="w-full border p-2 rounded" placeholder="Admin Username" onChange={e => setAdminCreds({...adminCreds, username: e.target.value})} required />
                            <input className="w-full border p-2 rounded" type="password" placeholder="Admin Password" onChange={e => setAdminCreds({...adminCreds, password: e.target.value})} required />
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowOverride(false)} className="flex-1 border p-2 rounded">Cancel</button>
                                <button type="submit" className="flex-1 bg-red-600 text-white p-2 rounded">Authorize</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}