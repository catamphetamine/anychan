import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/MemoryStorage'

const storage = new MemoryStorage({
	emulateSerialize: true
})
const userData = new UserData(storage, {
	prefix: ''
})
userData.data.trackedThreadsList.limit = 2

describe('UserData', () => {
	it('should trim collections on limit reach', () => {
		storage.clear()
		userData.addTrackedThreadsList({ board: { id: 'a' }, id: 123, title: 'Anime 1' })
		userData.addTrackedThreadsList({ board: { id: 'a' }, id: 124, title: 'Anime 2' })
		userData.addTrackedThreadsList({ board: { id: 'a' }, id: 125, title: 'Anime 3' })
		expectToEqual(storage.data.trackedThreadsList.length, 2)
		expectToEqual(storage.data.trackedThreadsList[0].title, 'Anime 2')
	})

	it('should trim expired items first', () => {
		storage.clear()
		userData.addTrackedThreadsList({ board: { id: 'a' }, id: 123, title: 'Anime 1' })
		userData.addTrackedThreadsList({ board: { id: 'a' }, id: 124, title: 'Anime 2', expired: true })
		userData.addTrackedThreadsList({ board: { id: 'a' }, id: 125, title: 'Anime 3' })
		expectToEqual(storage.data.trackedThreadsList.length, 2)
		expectToEqual(storage.data.trackedThreadsList[0].title, 'Anime 1')
		expectToEqual(storage.data.trackedThreadsList[1].title, 'Anime 3')
	})

	it('should add/remove/get favorite boards', () => {
		storage.clear()
		userData.addFavoriteBoards({ id: 'a' })
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					{ id: 'a' }
				]
			}
		)
		userData.addFavoriteBoards({ id: 'b' })
		// Ignores duplicates.
		userData.addFavoriteBoards({ id: 'b' })
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					{ id: 'a' },
					{ id: 'b' }
				]
			}
		)
		expectToEqual(
			userData.getFavoriteBoards(),
			[
				{ id: 'a' },
				{ id: 'b' }
			]
		)
		expectToEqual(
			userData.getFavoriteBoards({ id: 'a' }),
			{ id: 'a' }
		)
		expectToEqual(
			userData.getFavoriteBoards({ id: 'c' }),
			undefined
		)
		userData.removeFavoriteBoards({ id: 'c' })
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					{ id: 'a' },
					{ id: 'b' }
				]
			}
		)
		userData.removeFavoriteBoards({ id: 'b' })
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					{ id: 'a' }
				]
			}
		)
		userData.removeFavoriteBoards({ id: 'a' })
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge favorite boards (intersection)', () => {
		storage.clear()
		storage.data = {
			favoriteBoards: [
				{ id: 'a' },
				{ id: 'b' }
			]
		}
		userData.merge({
			favoriteBoards: [
				{ id: 'b' },
				{ id: 'c' }
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					{ id: 'a' },
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})

	it('should merge favorite boards (destination not exists)', () => {
		storage.data = {}
		userData.merge({
			favoriteBoards: [
				{ id: 'b' },
				{ id: 'c' }
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})

	it('should merge favorite boards (source not exists)', () => {
		storage.clear()
		storage.data = {
			favoriteBoards: [
				{ id: 'b' },
				{ id: 'c' }
			]
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})
})