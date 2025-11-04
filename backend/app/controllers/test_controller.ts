import type { HttpContext } from '@adonisjs/core/http'

export default class TestController {
	async create({ request, response }: HttpContext) {
		const payload = request.body()
		return response.ok({
			message: 'Test endpoint received your data',
			received: payload,
		})
	}
}
