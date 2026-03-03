const API_URL = 'http://localhost:8080/api';

export async function fetchApi(endpoint: string, options: RequestInit = {}, customToken?: string) {
    const token = customToken || (typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null);

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });

    if (!response.ok) {
        if (response.status === 403) throw new Error('FORBIDDEN');
        throw new Error('API Request Failed');
    }

    // Return empty object if no content (like DELETE)
    return response.status !== 204 ? response.json() : {};
}