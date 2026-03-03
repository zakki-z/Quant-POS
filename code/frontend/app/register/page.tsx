// app/register/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Register() {
    const [form, setForm] = useState({ fullName: '', username: '', password: '', role: 'USER' });
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error('Registration failed');
            alert('Success! Please log in.');
            router.push('/login');
        } catch (err) {
            alert('Registration failed. Check your inputs.');
        }
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-6 mt-12 rounded shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
            <form onSubmit={handleRegister} className="space-y-3">
                <input className="w-full border p-2 rounded" placeholder="Full Name" onChange={e => setForm({...form, fullName: e.target.value})} required />
                <input className="w-full border p-2 rounded" placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} required />
                <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} required />
                <select className="w-full border p-2 rounded" onChange={e => setForm({...form, role: e.target.value})}>
                    <option value="USER">Cashier (USER)</option>
                    <option value="ADMIN">Manager (ADMIN)</option>
                </select>
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Register</button>
            </form>
        </div>
    );
}