'use client';
import { useState, useEffect } from 'react';
import { products as productsApi, auth, type Product, ApiError } from '@/lib/api';

export default function Products() {
    const [productList, setProductList] = useState<Product[]>([]);
    const [newProduct, setNewProduct] = useState({ name: '', price: '' });
    const [loading, setLoading] = useState(true);

    // Admin Override Modal State
    const [showOverride, setShowOverride] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
    const [pendingAction, setPendingAction] = useState<(() => Promise<void>) | null>(null);
    const [overrideError, setOverrideError] = useState('');

    useEffect(() => { loadProducts(); }, []);

    const loadProducts = async () => {
        try {
            const data = await productsApi.getAll();
            setProductList(data);
        } catch (err) {
            console.error('Failed to load products:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action: () => Promise<void>) => {
        try {
            await action();
            loadProducts();
        } catch (err) {
            if (err instanceof ApiError && err.status === 403) {
                setPendingAction(() => action);
                setShowOverride(true);
                setOverrideError('');
            } else {
                alert('Action failed. Please try again.');
            }
        }
    };

    const createProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await productsApi.create(newProduct);
            setNewProduct({ name: '', price: '' });
            loadProducts();
        } catch {
            alert('Failed to create product.');
        }
    };

    const deleteProduct = (id: number) =>
        handleAction(() => productsApi.delete(id));

    const executeOverride = async (e: React.FormEvent) => {
        e.preventDefault();
        setOverrideError('');

        try {
            await auth.login(adminCreds.username, adminCreds.password);
            if (pendingAction) await pendingAction();
            setShowOverride(false);
            setAdminCreds({ username: '', password: '' });
            loadProducts();
        } catch {
            setOverrideError('Invalid admin credentials or insufficient privileges.');
        }
    };

    return (
        <div className="animate-in">
            <div className="mb-6">
                <h1
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    Products
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">Manage your product catalog</p>
            </div>

            <div className="card-flat p-6">
                {/* Add product form */}
                <div className="flex gap-3 mb-6 pb-6 border-b border-[var(--border)]">
                    <input
                        className="input flex-1"
                        placeholder="Product name"
                        value={newProduct.name}
                        onChange={e => setNewProduct({ ...newProduct, name: e.target.value })}
                        required
                    />
                    <input
                        className="input w-36"
                        type="number"
                        step="0.01"
                        placeholder="Price"
                        value={newProduct.price}
                        onChange={e => setNewProduct({ ...newProduct, price: e.target.value })}
                        required
                    />
                    <button onClick={createProduct} className="btn btn-primary px-6">
                        Add Product
                    </button>
                </div>

                {/* Product list */}
                {loading ? (
                    <div className="text-center py-12 text-[var(--text-muted)]">Loading…</div>
                ) : productList.length === 0 ? (
                    <div className="text-center py-12 text-[var(--text-muted)]">No products yet. Add your first one above.</div>
                ) : (
                    <div className="space-y-2">
                        {productList.map(p => (
                            <div key={p.id} className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-base)] border border-[var(--border)] hover:border-[var(--text-muted)] transition group">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] font-bold text-xs">
                                        {p.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <div className="font-semibold text-sm">{p.name}</div>
                                        <div className="text-xs text-[var(--text-muted)]">ID: {p.id}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="font-bold text-[var(--accent)]">${p.price.toFixed(2)}</span>
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        className="btn-danger opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Admin Override Modal */}
            {showOverride && (
                <div className="modal-overlay">
                    <div className="card p-6 max-w-sm w-full mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[var(--danger)] font-bold">
                                !
                            </div>
                            <div>
                                <h3 className="font-bold text-[var(--text-primary)]">Manager Authorization</h3>
                                <p className="text-xs text-[var(--text-muted)]">This action requires admin privileges</p>
                            </div>
                        </div>

                        {overrideError && (
                            <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                                {overrideError}
                            </div>
                        )}

                        <div className="space-y-3">
                            <input
                                className="input"
                                placeholder="Admin username"
                                value={adminCreds.username}
                                onChange={e => setAdminCreds({ ...adminCreds, username: e.target.value })}
                                required
                            />
                            <input
                                className="input"
                                type="password"
                                placeholder="Admin password"
                                value={adminCreds.password}
                                onChange={e => setAdminCreds({ ...adminCreds, password: e.target.value })}
                                required
                            />
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => { setShowOverride(false); setOverrideError(''); }}
                                    className="btn btn-ghost flex-1 py-2.5"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={executeOverride}
                                    className="btn btn-primary flex-1 py-2.5"
                                >
                                    Authorize
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}