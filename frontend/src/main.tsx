import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { AuthProvider, RequireAuth } from './auth'

createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<AuthProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />}> 
						<Route index element={<Login />} />
						<Route
							path="/dashboard"
							element={
								<RequireAuth>
									<Dashboard />
								</RequireAuth>
							}
						/>
						<Route path="*" element={<Navigate to="/" replace />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</AuthProvider>
	</React.StrictMode>
)
