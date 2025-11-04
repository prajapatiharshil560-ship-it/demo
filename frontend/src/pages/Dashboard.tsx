import { useEffect, useState } from 'react'
import { api, setToken } from '../api'
import { useAuth } from '../auth'

export default function Dashboard() {
	const { user, setUser } = useAuth()
	const [data, setData] = useState<any>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string | null>(null)

	useEffect(() => {
		let cancelled = false
		;(async () => {
			try {
				const res = await api.get('/api/dashboard')
				if (!cancelled) setData(res)
			} catch (err: any) {
				if (!cancelled) setError(err?.data?.error || 'Failed to load dashboard')
			} finally {
				if (!cancelled) setLoading(false)
			}
		})()
		return () => {
			cancelled = true
		}
	}, [])

	async function logout() {
		try {
			setToken(null)
			setUser(null)
			window.location.href = '/'
		} catch {}
	}

	return (
		<div>
			<h1>Dashboard</h1>
			<p>Welcome, <strong>{user?.email}</strong></p>
			<button onClick={logout}>Logout</button>
			<hr />
			{loading ? (
				<div>Loading data...</div>
			) : error ? (
				<div style={{ color: 'crimson' }}>{error}</div>
			) : (
				<pre>{JSON.stringify(data, null, 2)}</pre>
			)}
		</div>
	)
}
