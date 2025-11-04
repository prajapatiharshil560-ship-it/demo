import React, { createContext, useContext, useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { api, getToken } from './api'

export type AuthUser = { id: number; email: string } | null

type AuthContextType = {
	user: AuthUser
	setUser: React.Dispatch<React.SetStateAction<AuthUser>>
	loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<AuthUser>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		let cancelled = false
		;(async () => {
			try {
				if (!getToken()) {
					if (!cancelled) setUser(null)
					return
				}
				const me = await api.get('/api/user')
				if (!cancelled) setUser(me)
			} catch {
				if (!cancelled) setUser(null)
			} finally {
				if (!cancelled) setLoading(false)
			}
		})()
		return () => {
			cancelled = true
		}
	}, [])

	return (
		<AuthContext.Provider value={{ user, setUser, loading }}>
			{children}
		</AuthContext.Provider>
	)
}

export function useAuth() {
	const ctx = useContext(AuthContext)
	if (!ctx) throw new Error('useAuth must be used within AuthProvider')
	return ctx
}

export function RequireAuth({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuth()
	const location = useLocation()
	if (loading) return <div>Loading...</div>
	if (!user) return <Navigate to="/" replace state={{ from: location }} />
	return <>{children}</>
}
