import { defineConfig } from '@adonisjs/auth'

const authConfig = defineConfig({
	default: 'web',
	guards: {
		web: {
			driver: 'session',
			provider: {
				driver: 'lucid',
				identifierKey: 'id',
				uids: ['email'],
				model: () => import('#models/user')
			},
			rememberMeTokens: {
				driver: 'db'
			}
		}
	}
})

export default authConfig
