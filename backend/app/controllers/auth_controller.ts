import type { HttpContext } from '@adonisjs/core/http'
import vine, { errors as vineErrors } from '@vinejs/vine'
import User from '#models/user'
import hash from '@adonisjs/core/services/hash'
import jwt from 'jsonwebtoken'
import env from '#start/env'

const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(6),
  })
)

export default class AuthController {
  async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const user = await User.findBy('email', email)
      if (!user) return response.unauthorized({ error: 'Invalid credentials' })
      const ok = await hash.verify(user.password, password)
      if (!ok) return response.unauthorized({ error: 'Invalid credentials' })
      const secret = env.get('JWT_SECRET') || env.get('APP_KEY')
      const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '2h' })
      return response.ok({ token, user: { id: user.id, email: user.email } })
    } catch (error) {
      if (error instanceof vineErrors.E_VALIDATION_ERROR) {
        return response.badRequest({ errors: error.messages })
      }
      return response.unauthorized({ error: 'Invalid credentials' })
    }
  }

  async register({ request, response }: HttpContext) {
    try {
      const { email, password } = await request.validateUsing(loginValidator)
      const existing = await User.findBy('email', email)
      if (existing) return response.conflict({ error: 'User already exists' })
      const user = await User.create({ email, password })
      const secret = env.get('JWT_SECRET') || env.get('APP_KEY')
      const token = jwt.sign({ sub: user.id, email: user.email }, secret, { expiresIn: '2h' })
      return response.created({ message: 'User registered', id: user.id, email: user.email, token })
    } catch (error) {
      if (error instanceof vineErrors.E_VALIDATION_ERROR) {
        return response.badRequest({ errors: error.messages })
      }
      return response.internalServerError({ error: 'Unable to register' })
    }
  }

  async logout({ response }: HttpContext) {
    // JWT logout is client-side (delete token)
    return response.ok({ message: 'Logged out' })
  }

  async me(ctx: HttpContext) {
    const user = (ctx as any).authUser
    if (!user) return ctx.response.unauthorized({ error: 'Unauthorized' })
    return ctx.response.ok(user)
  }
}
