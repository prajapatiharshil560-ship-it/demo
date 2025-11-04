const DEFAULT_BASE_URL = 'http://localhost:3333'
const envBaseUrl: string | undefined = import.meta.env.VITE_API_BASE_URL
const BASE_URL = ((envBaseUrl && envBaseUrl.trim()) || DEFAULT_BASE_URL).replace(/\/$/, '')
if (!envBaseUrl || !envBaseUrl.trim()) {
  console.warn('[api] VITE_API_BASE_URL is not set; defaulting to', DEFAULT_BASE_URL)
}

let authToken: string | null = (typeof localStorage !== 'undefined' && localStorage.getItem('token')) || null

export function setToken(token: string | null) {
  authToken = token
  try {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  } catch {}
}

export function getToken() {
  return authToken
}

type Options = RequestInit & { json?: any }

async function request<T>(path: string, options: Options = {}): Promise<T> {
  const headers: HeadersInit = { 'Content-Type': 'application/json', ...(options.headers || {}) }
  const token = getToken()
  if (token) {
    ;(headers as any).Authorization = `Bearer ${token}`
  }
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : options.body,
  })
  const isJson = res.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await res.json() : (null as any)
  if (!res.ok) {
    throw Object.assign(new Error('Request failed'), { status: res.status, data })
  }
  return data as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, json?: any) => request<T>(path, { method: 'POST', json }),
}
