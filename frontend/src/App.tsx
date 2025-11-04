import { Outlet } from 'react-router-dom'

export default function App() {
	return (
		<div style={{ fontFamily: 'system-ui, sans-serif', margin: '2rem auto', maxWidth: 520 }}>
			<Outlet />
		</div>
	)
}
