import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setToken } from '../api'
import { useAuth } from '../auth'

export default function Login() {
	const navigate = useNavigate()
	const { setUser } = useAuth()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [loading, setLoading] = useState(false)

	async function onSubmit(e: FormEvent) {
		e.preventDefault()
		setLoading(true)
		setError(null)
		try {
			const res = await api.post<{ token: string; user: { id: number; email: string } }>(
				'/api/login',
				{ email, password }
			)
			setToken(res.token)
			setUser(res.user)
			navigate('/dashboard', { replace: true })
		} catch (err: any) {
			setError(err?.data?.error || 'Login failed')
		} finally {
			setLoading(false)
		}
	}

	return (
		<div>
			<h1>Login</h1>
			<form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit" disabled={loading}>
					{loading ? 'Signing in...' : 'Login'}
				</button>
				{error && <div style={{ color: 'crimson' }}>{error}</div>}
			</form>
		</div>
	)
}
