import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/storage/MemoryStorage'

const storage = new MemoryStorage({
	emulateSerialize: true
})
const userData = new UserData(storage, {
	prefix: ''
})
userData.collections.trackedThreadsList.limit = 2

describe('UserData', () => {
	it('should trim collections on limit reach', () => {
		storage.clear()
		userData.addTrackedThreadsList({ channel: { id: 'a' }, id: 123, title: 'Anime 1' })
		userData.addTrackedThreadsList({ channel: { id: 'a' }, id: 124, title: 'Anime 2' })
		userData.addTrackedThreadsList({ channel: { id: 'a' }, id: 125, title: 'Anime 3' })
		expectToEqual(storage.data.trackedThreadsList.length, 2)
		expectToEqual(storage.data.trackedThreadsList[0].title, 'Anime 2')
	})

	it('should trim expired items first', () => {
		storage.clear()
		userData.addTrackedThreadsList({ channel: { id: 'a' }, id: 123, title: 'Anime 1' })
		userData.addTrackedThreadsList({ channel: { id: 'a' }, id: 124, title: 'Anime 2', expired: true })
		userData.addTrackedThreadsList({ channel: { id: 'a' }, id: 125, title: 'Anime 3' })
		expectToEqual(storage.data.trackedThreadsList.length, 2)
		expectToEqual(storage.data.trackedThreadsList[0].title, 'Anime 1')
		expectToEqual(storage.data.trackedThreadsList[1].title, 'Anime 3')
	})

	it('should add/remove/get favorite channels', () => {
		storage.clear()
		userData.addFavoriteChannels({ id: 'a' })
		expectToEqual(
			storage.data,
			{
				favoriteChannels: [
					{ id: 'a' }
				]
			}
		)
		userData.addFavoriteChannels({ id: 'b' })
		// Ignores duplicates.
		userData.addFavoriteChannels({ id: 'b' })
		expectToEqual(
			storage.data,
			{
				favoriteChannels: [
					{ id: 'a' },
					{ id: 'b' }
				]
			}
		)
		expectToEqual(
			userData.getFavoriteChannels(),
			[
				{ id: 'a' },
				{ id: 'b' }
			]
		)
		expectToEqual(
			userData.getFavoriteChannels({ id: 'a' }),
			{ id: 'a' }
		)
		expectToEqual(
			userData.getFavoriteChannels({ id: 'c' }),
			undefined
		)
		userData.removeFavoriteChannels({ id: 'c' })
		expectToEqual(
			storage.data,
			{
				favoriteChannels: [
					{ id: 'a' },
					{ id: 'b' }
				]
			}
		)
		userData.removeFavoriteChannels({ id: 'b' })
		expectToEqual(
			storage.data,
			{
				favoriteChannels: [
					{ id: 'a' }
				]
			}
		)
		userData.removeFavoriteChannels({ id: 'a' })
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge favorite channels (intersection)', () => {
		storage.clear()
		storage.data = {
			favoriteChannels: [
				{ id: 'a' },
				{ id: 'b' }
			]
		}
		userData.merge({
			favoriteChannels: [
				{ id: 'b' },
				{ id: 'c' }
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteChannels: [
					{ id: 'a' },
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})

	it('should merge favorite channels (destination not exists)', () => {
		storage.data = {}
		userData.merge({
			favoriteChannels: [
				{ id: 'b' },
				{ id: 'c' }
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteChannels: [
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})

	it('should merge favorite channels (source not exists)', () => {
		storage.clear()
		storage.data = {
			favoriteChannels: [
				{ id: 'b' },
				{ id: 'c' }
			]
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				favoriteChannels: [
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})
})