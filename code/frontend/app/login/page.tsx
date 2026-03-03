// app/login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
    const [form, setForm] = useState({ username: '', password: '' });
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            if (!res.ok) throw new Error('Login failed');
            const data = await res.json();
            localStorage.setItem('accessToken', data.accessToken);
            router.push('/pos');
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    return (
        <div className="max-w-sm mx-auto bg-white p-6 mt-12 rounded shadow-sm border border-gray-100">
            <h2 className="text-2xl font-bold mb-4">Sign In</h2>
            <form onSubmit={handleLogin} className="space-y-3">
                <input className="w-full border p-2 rounded" placeholder="Username" onChange={e => setForm({...form, username: e.target.value})} required />
                <input className="w-full border p-2 rounded" type="password" placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} required />
                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Login</button>
            </form>
            <div className="mt-4 text-sm">Don't have an account? <Link href="/register" className="text-blue-600">Sign Up</Link></div>
        </div>
    );
}