import { BaseModel, column, beforeSave } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'

export default class User extends BaseModel {
	@column({ isPrimary: true })
	declare id: number

	@column()
	declare email: string

	@column({ serializeAs: null })
	declare password: string

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime

	@beforeSave()
	static async hashPassword(user: User) {
		if (user.$dirty.password) {
			user.password = await hash.make(user.password)
		}
	}
}
