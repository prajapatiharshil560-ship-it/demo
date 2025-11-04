import type { HttpContext } from '@adonisjs/core/http'

export default class DashboardController {
	async index({ response }: HttpContext) {
		return response.ok({
			stats: {
				users: Math.floor(Math.random() * 1000) + 100,
				revenue: Number((Math.random() * 10000).toFixed(2)),
				active: Math.floor(Math.random() * 200),
			},
			notifications: [
				{ id: 1, message: 'Welcome to the dashboard!' },
				{ id: 2, message: 'Your profile is 90% complete.' },
			],
		})
	}
}
