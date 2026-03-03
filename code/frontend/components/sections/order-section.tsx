// app/orders/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';

type Order = { id: number; description: string; totalPrice: number; quantity: number };

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        fetchApi('/v1.0/orders').then(setOrders).catch(console.error);
    }, []);

    return (
        <div className="bg-white p-6 rounded shadow-sm border">
            <h2 className="text-xl font-bold mb-4">Order History</h2>
            <div className="space-y-3">
                {orders.map(order => (
                    <div key={order.id} className="p-4 border rounded bg-gray-50 flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-sm text-gray-500">Order #{order.id}</div>
                            <div className="mt-1">{order.description}</div>
                        </div>
                        <div className="text-right">
                            <div className="font-bold">${order.totalPrice.toFixed(2)}</div>
                            <div className="text-xs text-gray-400">{order.quantity} items</div>
                        </div>
                    </div>
                ))}
                {orders.length === 0 && <p className="text-gray-500 text-sm">No orders found.</p>}
            </div>
        </div>
    );
}