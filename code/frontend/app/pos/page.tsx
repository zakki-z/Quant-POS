// app/pos/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

type Product = { id: number; name: string; price: number };
type CartItem = Product & { quantity: number };

export default function POS() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        fetchApi('/v1.0/products').then(setProducts).catch(console.error);
    }, []);

    const addToCart = (product: Product) => {
        setCart(prev => {
            const exists = prev.find(item => item.id === product.id);
            if (exists) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleCheckout = async () => {
        if (cart.length === 0) return;
        const description = cart.map(c => `${c.name} x${c.quantity}`).join(', ');
        const orderData = {
            quantity: cart.reduce((sum, item) => sum + item.quantity, 0),
            totalPrice: total,
            paidAmount: total,
            remainingAmount: 0,
            description
        };

        try {
            await fetchApi('/v1.0/orders', { method: 'POST', body: JSON.stringify(orderData) });
            alert('Checkout Successful!');
            setCart([]);
        } catch (err) {
            alert('Checkout failed');
        }
    };

    return (
        <div className="flex gap-6">
            <div className="flex-1 grid grid-cols-3 gap-4">
                {products.map(p => (
                    <div key={p.id} onClick={() => addToCart(p)} className="p-4 bg-white border rounded cursor-pointer hover:shadow-md transition">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-sm text-gray-500">${p.price.toFixed(2)}</div>
                    </div>
                ))}
            </div>
            <div className="w-80 bg-white p-4 border rounded shadow-sm h-fit">
                <h3 className="font-bold mb-4 border-b pb-2">Current Order</h3>
                <div className="space-y-2 mb-4">
                    {cart.map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <div className="border-t pt-2 font-bold flex justify-between mb-4">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                </div>
                <button onClick={handleCheckout} className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700">Checkout</button>
            </div>
        </div>
    );
}