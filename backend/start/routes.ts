/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const AuthController = () => import('#controllers/auth_controller')
const DashboardController = () => import('#controllers/dashboard_controller')
const TestController = () => import('#controllers/test_controller')

router.get('/', async () => {
	return {
		hello: 'world',
	}
})

router.group(() => {
	// Auth
	router.post('/login', [AuthController, 'login'])
	router.post('/logout', [AuthController, 'logout'])
	router.post('/register', [AuthController, 'register'])

	// Protected endpoints (JWT)
	router.get('/user', [AuthController, 'me']).use(middleware.jwtAuth())
	router.get('/dashboard', [DashboardController, 'index']).use(middleware.jwtAuth())

	// Public test endpoint
	router.post('/test', [TestController, 'create'])
}).prefix('/api')
