import type { HttpContext } from '@adonisjs/core/http'

export default async function authGuard({ auth, response }: HttpContext) {
	const isAuthenticated = await auth.check()
	if (!isAuthenticated) {
		return response.unauthorized({ error: 'Unauthorized' })
	}
}
