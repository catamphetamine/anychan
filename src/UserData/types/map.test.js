import UserData from '../UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData/map', () => {
	it('should support map collections and encode/decode properties', () => {
		const COLLECTIONS = {
			objects: {
				name: 'objects',
				shortName: null,
				type: 'map',
				encode(object) {
					object.n = String(object.number)
					delete object.number
					return object
				},
				decode(object) {
					object.number = Number(object.n)
					delete object.n
					return object
				},
				// `a` and `b` are encoded.
				merge: (a, b) => Number(a.n) > Number(b.n) ? a : b,
				// // `a` and `b` are encoded.
				// match: (encoded, _) => encoded.value === _.value,
				schema: {
					number: {
						type: 'number',
						description: 'Number'
					}
				}
			}
		}

		const storage = new MemoryStorage()

		const userData = new UserData(storage, {
			collections: COLLECTIONS
		})

		userData.setInObjects('1', {
			number: 1
		})

		expectToEqual(
			storage.getData().objects,
			{
				'1': {
					n: '1'
				}
			}
		)

		expectToEqual(
			userData.get().objects,
			{
				'1': {
					n: '1'
				}
			}
		)

		userData.setInObjects('1', {
			number: 2
		})

		expectToEqual(
			storage.getData().objects,
			{
				'1': {
					n: '2'
				}
			}
		)

		expectToEqual(
			userData.get().objects,
			{
				'1': {
					n: '2'
				}
			}
		)

		userData.setObjects({
			'1': {
				number: 3
			}
		})

		expectToEqual(
			storage.getData().objects,
			{
				'1': {
					n: '3'
				}
			}
		)

		expectToEqual(
			userData.get().objects,
			{
				'1': {
					n: '3'
				}
			}
		)

		expectToEqual(
			userData.getObjects(),
			{
				'1': {
					number: 3
				}
			}
		)

		expectToEqual(
			userData.getFromObjects('1'),
			{
				number: 3
			}
		)

		userData.removeFromObjects('1')

		expectToEqual(
			userData.get().objects,
			undefined
		)
	})
})