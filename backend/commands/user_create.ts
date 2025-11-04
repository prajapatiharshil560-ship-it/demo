import { BaseCommand, flags } from '@adonisjs/core/ace'

export default class UserCreate extends BaseCommand {
  static commandName = 'user:create'
  static description = 'Create a user (email + password)'
  static options = {
    startApp: true,
  }

  @flags.string({ description: 'Email for the new user' })
  declare email?: string

  @flags.string({ description: 'Password for the new user' })
  declare password?: string

  async run() {
    const email = this.email ?? (await this.prompt.ask('Email'))
    const password = this.password ?? (await this.prompt.secure('Password'))

    const User = (await import('#models/user')).default

    const existing = await User.findBy('email', email)
    if (existing) {
      this.logger.error(`User with email ${email} already exists`)
      this.exitCode = 1
      return
    }

    const user = await User.create({ email, password })
    this.logger.success(`Created user ${user.email} (id: ${user.id})`)
  }
}
