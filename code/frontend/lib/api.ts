const API_BASE = 'http://localhost:8080/api';

// ── Debug logger ──────────────────────────────────────────
const DEBUG = process.env.NODE_ENV !== 'production';

function log(level: 'info' | 'warn' | 'error', message: string, data?: unknown) {
    if (!DEBUG) return;
    const prefix = `[API ${level.toUpperCase()}]`;
    const timestamp = new Date().toISOString();
    switch (level) {
        case 'info':
            console.log(`${prefix} ${timestamp} — ${message}`, data ?? '');
            break;
        case 'warn':
            console.warn(`${prefix} ${timestamp} — ${message}`, data ?? '');
            break;
        case 'error':
            console.error(`${prefix} ${timestamp} — ${message}`, data ?? '');
            break;
    }
}

// ── Token helpers ─────────────────────────────────────────
export function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('refreshToken');
}

export function setTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
}

export function clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
}

/**
 * Extracts the username (subject) from the current JWT access token.
 * Returns null if no token is present or the token is malformed.
 */
export function getUsername(): string | null {
    const token = getAccessToken();
    if (!token) return null;

    try {
        // JWT structure: header.payload.signature — we need the payload
        const parts = token.split('.');
        if (parts.length !== 3) return null;

        // Base64url decode the payload
        const payload = parts[1];
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
        const parsed = JSON.parse(decoded);

        // The backend sets the username as the JWT "sub" (subject) claim
        return parsed.sub ?? null;
    } catch {
        return null;
    }
}

// ── Custom error class ────────────────────────────────────
export class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

// ── Core fetch wrapper ────────────────────────────────────
async function request<T>(
    endpoint: string,
    options: RequestInit = {},
    customToken?: string,
): Promise<T> {
    const url = `${API_BASE}${endpoint}`;
    const token = customToken || getAccessToken();

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers as Record<string, string> ?? {}),
    };

    log('info', `${options.method ?? 'GET'} ${endpoint}`, options.body ? JSON.parse(options.body as string) : undefined);

    const start = performance.now();

    try {
        const res = await fetch(url, { ...options, headers });
        const duration = Math.round(performance.now() - start);

        if (!res.ok) {
            const errorBody = await res.text().catch(() => 'No body');
            log('error', `${res.status} ${res.statusText} (${duration}ms) — ${endpoint}`, errorBody);

            if (res.status === 403) throw new ApiError('FORBIDDEN', 403);
            if (res.status === 401) throw new ApiError('UNAUTHORIZED', 401);
            throw new ApiError(errorBody || `Request failed with status ${res.status}`, res.status);
        }

        if (res.status === 204) {
            log('info', `204 No Content (${duration}ms) — ${endpoint}`);
            return {} as T;
        }

        const data = await res.json();
        log('info', `${res.status} OK (${duration}ms) — ${endpoint}`, data);
        return data as T;
    } catch (err) {
        if (err instanceof ApiError) throw err;
        log('error', `Network error — ${endpoint}`, err);
        throw new ApiError('Network error. Is the server running?', 0);
    }
}

// ── Types ─────────────────────────────────────────────────
export type Product = { id: number; name: string; price: number };
export type Order = { id: number; description: string; totalPrice: number; quantity: number; paidAmount: number; remainingAmount: number };
export type TokenPair = { accessToken: string; refreshToken: string };
export type UserInfo = { id: number; username: string; role: string };

// ── Auth endpoints ────────────────────────────────────────
export const auth = {
    async login(username: string, password: string): Promise<TokenPair> {
        const data = await request<TokenPair>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
        });
        setTokens(data.accessToken, data.refreshToken);
        return data;
    },

    async register(fullName: string, username: string, password: string, role: string): Promise<string> {
        return request<string>('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ fullName, username, password, role }),
        });
    },

    async refreshToken(): Promise<TokenPair> {
        const refreshToken = getRefreshToken();
        if (!refreshToken) throw new ApiError('No refresh token available', 401);
        const data = await request<TokenPair>('/auth/refresh-token', {
            method: 'POST',
            body: JSON.stringify({ refreshToken }),
        });
        setTokens(data.accessToken, data.refreshToken);
        return data;
    },

    logout() {
        clearTokens();
    },
};

// ── Product endpoints ─────────────────────────────────────
export const products = {
    async getAll(customToken?: string): Promise<Product[]> {
        return request<Product[]>('/v1.0/products', {}, customToken);
    },

    async getById(id: number, customToken?: string): Promise<Product> {
        return request<Product>(`/v1.0/products/${id}`, {}, customToken);
    },

    async create(product: { name: string; price: string | number }, customToken?: string): Promise<Product> {
        return request<Product>('/v1.0/products', {
            method: 'POST',
            body: JSON.stringify(product),
        }, customToken);
    },

    async update(id: number, product: Partial<Product>, customToken?: string): Promise<Product> {
        return request<Product>(`/v1.0/products/${id}`, {
            method: 'PUT',
            body: JSON.stringify(product),
        }, customToken);
    },

    async delete(id: number, customToken?: string): Promise<void> {
        await request<void>(`/v1.0/products/${id}`, { method: 'DELETE' }, customToken);
    },
};

// ── Order endpoints ───────────────────────────────────────
export const orders = {
    async getAll(customToken?: string): Promise<Order[]> {
        return request<Order[]>('/v1.0/orders', {}, customToken);
    },
    async getAllByUser(customToken?: string): Promise<Order[]> {
        return request<Order[]>('/v1.0/orders', {}, customToken);
    },

    async getById(id: number, customToken?: string): Promise<Order> {
        return request<Order>(`/v1.0/orders/${id}`, {}, customToken);
    },

    async create(
        order: { quantity: number; totalPrice: number; paidAmount: number; remainingAmount: number; description: string },
        customToken?: string,
    ): Promise<Order> {
        return request<Order>('/v1.0/orders', {
            method: 'POST',
            body: JSON.stringify(order),
        }, customToken);
    },

    async update(id: number, order: Partial<Order>, customToken?: string): Promise<Order> {
        return request<Order>(`/v1.0/orders/${id}`, {
            method: 'PUT',
            body: JSON.stringify(order),
        }, customToken);
    },

    async delete(id: number, customToken?: string): Promise<void> {
        await request<void>(`/v1.0/orders/${id}`, { method: 'DELETE' }, customToken);
    },
};

// ── User endpoints (Admin) ────────────────────────────────
export const users = {
    async getAll(customToken?: string): Promise<UserInfo[]> {
        return request<UserInfo[]>('/users', {}, customToken);
    },

    async getById(id: number, customToken?: string): Promise<UserInfo> {
        return request<UserInfo>(`/users/${id}`, {}, customToken);
    },

    async update(id: number, user: { username?: string; password?: string }, customToken?: string): Promise<UserInfo> {
        return request<UserInfo>(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        }, customToken);
    },

    async delete(id: number, customToken?: string): Promise<void> {
        await request<void>(`/users/${id}`, { method: 'DELETE' }, customToken);
    },
};