import { defineConfig, stores } from '@adonisjs/session'
import env from '#start/env'

const sessionConfig = defineConfig({
	store: 'cookie',
	cookieName: 'adonis_session',
	clearWithBrowser: false,
	age: '2h',
	cookie: {
		path: '/',
		secure: env.get('NODE_ENV') === 'production',
		httpOnly: true,
		sameSite: 'lax',
		domain: undefined,
	},
	stores: {
		cookie: stores.cookie(),
	},
})

export default sessionConfig
