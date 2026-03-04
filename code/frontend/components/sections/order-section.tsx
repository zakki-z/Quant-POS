'use client';
import { useState, useEffect } from 'react';
import { orders as ordersApi, type Order } from '@/lib/api';

export default function Orders() {
    const [orderList, setOrderList] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        ordersApi.getAll()
            .then(setOrderList)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="animate-in">
            <div className="mb-6">
                <h1
                    className="text-2xl font-bold tracking-tight"
                    style={{ fontFamily: 'Playfair Display, serif' }}
                >
                    Order History
                </h1>
                <p className="text-sm text-[var(--text-muted)] mt-1">
                    {orderList.length > 0
                        ? `${orderList.length} order${orderList.length !== 1 ? 's' : ''} on record`
                        : 'Your completed orders will appear here'
                    }
                </p>
            </div>

            <div className="card-flat overflow-hidden">
                {loading ? (
                    <div className="text-center py-16 text-[var(--text-muted)]">Loading orders…</div>
                ) : orderList.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-4xl mb-3 opacity-30">📋</div>
                        <p className="text-[var(--text-muted)] text-sm">No orders found. Process your first sale from the POS page.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[var(--border)]">
                        {orderList.map((order, index) => (
                            <div
                                key={order.id}
                                className="flex items-center justify-between p-5 hover:bg-[var(--bg-base)] transition"
                                style={{ animationDelay: `${index * 40}ms` }}
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent)] font-bold text-xs">
                                        #{order.id}
                                    </div>
                                    <div>
                                        <div className="font-medium text-sm text-[var(--text-primary)]">{order.description}</div>
                                        <div className="text-xs text-[var(--text-muted)] mt-0.5">
                                            {order.quantity} item{order.quantity !== 1 ? 's' : ''}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="font-bold text-[var(--accent)]">${order.totalPrice.toFixed(2)}</div>
                                    {order.remainingAmount > 0 && (
                                        <div className="text-xs text-[var(--danger)] mt-0.5">
                                            ${order.remainingAmount.toFixed(2)} remaining
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}