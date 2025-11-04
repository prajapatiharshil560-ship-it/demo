import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'
import jwt from 'jsonwebtoken'
import User from '#models/user'

export default class JwtAuth {
  public async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    const authHeader = request.header('Authorization') || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : ''
    if (!token) {
      return response.unauthorized({ error: 'Unauthorized' })
    }
    try {
      const secret = env.get('JWT_SECRET') || env.get('APP_KEY')
      const decoded = jwt.verify(token, secret) as jwt.JwtPayload

      let subValue: number | undefined
      if (typeof decoded.sub === 'string') {
        subValue = Number.parseInt(decoded.sub, 10)
      } else {
        subValue = decoded.sub as number | undefined
      }

      if (!subValue || Number.isNaN(subValue)) {
        return response.unauthorized({ error: 'Unauthorized' })
      }
      const user = await User.find(subValue as number)
      if (!user) return response.unauthorized({ error: 'Unauthorized' })
      ;(ctx as any).authUser = { id: user.id, email: user.email }
      await next()
    } catch {
      return response.unauthorized({ error: 'Unauthorized' })
    }
  }
}
