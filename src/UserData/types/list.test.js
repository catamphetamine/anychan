import UserData from '../UserData.js'
import { MemoryStorage } from 'web-browser-storage'

function create() {
	const storage = new MemoryStorage()

	const collections = {
		simpleList: {
			name: 'simpleList',
			shortName: null,
			type: 'list',
			maxCount: 3,
			trim: (list, limit) => {
				return list.filter(_ => !_.canBeRemoved)
			},
			match: (encoded, _) => encoded === _,
			schema: {
				title: {
					type: 'string',
					description: 'Title'
				},
				canBeRemoved: {
					type: 'boolean',
					description: 'Can be removed flag',
					required: false
				}
			}
		},
		objectsWithIds: {
			name: 'objectsWithIds',
			shortName: null,
			type: 'list',
			match: (encoded, _) => encoded.id === _.id,
			schema: {
				id: {
					type: 'string',
					description: 'ID'
				}
			}
		}
	}

	const userData = new UserData(storage, { collections })

	return { storage, userData }
}

describe('UserData', () => {
	it('should trim collections on limit reach', () => {
		const { storage, userData } = create()
		userData.addToSimpleList({
			title: 'Anime 1'
		})
		userData.addToSimpleList({
			title: 'Anime 2'
		})
		userData.addToSimpleList({
			title: 'Anime 3'
		})
		userData.addToSimpleList({
			title: 'Anime 4'
		})
		expectToEqual(userData.get().simpleList.length, 3)
		expectToEqual(userData.get().simpleList[0].title, 'Anime 2')
	})

	it('should trim expired items first', () => {
		const { storage, userData } = create()
		userData.addToSimpleList({
			title: 'Anime 1'
		})
		userData.addToSimpleList({
			title: 'Anime 2',
			canBeRemoved: true
		})
		userData.addToSimpleList({
			title: 'Anime 3'
		})
		userData.addToSimpleList({
			title: 'Anime 4'
		})
		expectToEqual(userData.get().simpleList.length, 3)
		expectToEqual(userData.get().simpleList[0].title, 'Anime 1')
		expectToEqual(userData.get().simpleList[1].title, 'Anime 3')
		expectToEqual(userData.get().simpleList[2].title, 'Anime 4')
	})

	it('should add/remove/get objects with IDs channels', () => {
		const { storage, userData } = create()
		userData.addToObjectsWithIds({ id: 'a' })
		expectToEqual(
			userData.get(),
			{
				objectsWithIds: [
					{ id: 'a' }
				]
			}
		)
		userData.addToObjectsWithIds({ id: 'b' })
		// Ignores duplicates.
		userData.addToObjectsWithIds({ id: 'b' })
		expectToEqual(
			userData.get(),
			{
				objectsWithIds: [
					{ id: 'a' },
					{ id: 'b' }
				]
			}
		)
		expectToEqual(
			userData.getObjectsWithIds(),
			[
				{ id: 'a' },
				{ id: 'b' }
			]
		)
		expectToEqual(
			userData.getFromObjectsWithIds({ id: 'a' }),
			{ id: 'a' }
		)
		expectToEqual(
			userData.getFromObjectsWithIds({ id: 'c' }),
			undefined
		)
		userData.removeFromObjectsWithIds({ id: 'c' })
		expectToEqual(
			userData.get(),
			{
				objectsWithIds: [
					{ id: 'a' },
					{ id: 'b' }
				]
			}
		)
		userData.removeFromObjectsWithIds({ id: 'b' })
		expectToEqual(
			userData.get(),
			{
				objectsWithIds: [
					{ id: 'a' }
				]
			}
		)
		userData.removeFromObjectsWithIds({ id: 'a' })
		expectToEqual(
			userData.get(),
			{}
		)
	})

	it('should merge objects with IDs (intersection)', () => {
		const { storage, userData } = create()
		userData.replace({
			objectsWithIds: [
				{ id: 'a' },
				{ id: 'b' }
			]
		})
		userData.merge({
			objectsWithIds: [
				{ id: 'b' },
				{ id: 'c' }
			]
		})
		expectToEqual(
			userData.get(),
			{
				objectsWithIds: [
					{ id: 'a' },
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})

	it('should merge objects with IDs (destination not exists)', () => {
		const { storage, userData } = create()
		userData.merge({
			objectsWithIds: [
				{ id: 'b' },
				{ id: 'c' }
			]
		})
		expectToEqual(
			userData.get(),
			{
				objectsWithIds: [
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})

	it('should merge favorite channels (source not exists)', () => {
		const { storage, userData } = create()
		userData.replace({
			objectsWithIds: [
				{ id: 'b' },
				{ id: 'c' }
			]
		})
		userData.merge({})
		expectToEqual(
			userData.get(),
			{
				objectsWithIds: [
					{ id: 'b' },
					{ id: 'c' }
				]
			}
		)
	})
})