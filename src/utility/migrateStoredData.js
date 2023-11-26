import exclusiveExecution from './exclusiveExecution.js'
import migrate, { requiresMigration } from './migrate.js'

export default async function migrateStoredData({
	dispatch,
	userData,
	userSettings
}) {
	// Migrate `localStorage` data.
	await exclusiveExecution(async () => {
		migrate({
			collections: userData.collections,
			dispatch,
			userSettings
		})
	}, {
		name: 'Migration',
		timeout: 60 * 1000,
		condition: () => requiresMigration()
	})

	// Migrate User Data.
	await exclusiveExecution(async () => {
		userData.migrate()
	}, {
		name: 'User-Data-Migration',
		timeout: 60 * 1000,
		condition: () => userData.requiresMigration()
	})

	// Migrate User Settings.
	await exclusiveExecution(async () => {
		userSettings.migrate()
	}, {
		name: 'User-Settings-Migration',
		timeout: 60 * 1000,
		condition: () => userSettings.requiresMigration()
	})
}