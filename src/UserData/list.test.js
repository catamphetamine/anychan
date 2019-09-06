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

	it('should add/remove/get favorite boards', () => {
		storage.clear()
		userData.addFavoriteBoards('a')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a'
				]
			}
		)
		userData.addFavoriteBoards('b')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a',
					'b'
				]
			}
		)
		expectToEqual(
			userData.getFavoriteBoards(),
			[
				'a',
				'b'
			]
		)
		expectToEqual(
			userData.getFavoriteBoards('a'),
			true
		)
		expectToEqual(
			userData.getFavoriteBoards('c'),
			false
		)
		userData.removeFavoriteBoards('c')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a',
					'b'
				]
			}
		)
		userData.removeFavoriteBoards('b')
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a'
				]
			}
		)
		userData.removeFavoriteBoards('a')
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge favorite boards (intersection)', () => {
		storage.clear()
		storage.data = {
			favoriteBoards: [
				'a',
				'b'
			]
		}
		userData.merge({
			favoriteBoards: [
				'b',
				'c'
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'a',
					'b',
					'c'
				]
			}
		)
	})

	it('should merge favorite boards (destination not exists)', () => {
		storage.data = {}
		userData.merge({
			favoriteBoards: [
				'b',
				'c'
			]
		})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'b',
					'c'
				]
			}
		)
	})

	it('should merge favorite boards (source not exists)', () => {
		storage.clear()
		storage.data = {
			favoriteBoards: [
				'b',
				'c'
			]
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				favoriteBoards: [
					'b',
					'c'
				]
			}
		)
	})
})