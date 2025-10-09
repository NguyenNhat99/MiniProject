
const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || '';

export async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
    const res = await fetch(url, init);
    if (!res.ok) {
        throw new Error(`Error fetching ${url}: ${res.statusText}`);
    }
    if(res.status === 204){
        return undefined as T;
    }
    return res.json() as Promise<T>;
}

export const apiUrl = (pathname: string) => {
    return new URL(pathname, API_BASE).toString();
}