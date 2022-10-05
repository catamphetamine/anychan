import UserData from '../UserData'
import { MemoryStorage } from 'web-browser-storage'

function create() {
	const storage = new MemoryStorage()
	const userData = new UserData(storage)
	return { storage, userData }
}

describe('UserData', () => {
	it('should add/remove/get hidden threads', () => {
		const { storage, userData } = create()
		userData.addHiddenThreads('a', 123)
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [
						123
					]
				}
			}
		)
		userData.addHiddenThreads('a', 456)
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.addHiddenThreads('b', 789)
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				}
			}
		)
		expectToEqual(
			userData.getHiddenThreads(),
			{
				a: [
					123,
					456
				],
				b: [
					789
				]
			}
		)
		expectToEqual(
			userData.getHiddenThreads('a'),
			[
				123,
				456
			]
		)
		expectToEqual(
			userData.getHiddenThreads('c'),
			[]
		)
		expectToEqual(
			userData.getHiddenThreads('a', 123),
			true
		)
		expectToEqual(
			userData.getHiddenThreads('a', 789),
			false
		)
		expectToEqual(
			userData.getHiddenThreads('c', 111),
			false
		)
		userData.removeHiddenThreads('b')
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.removeHiddenThreads('b', 789)
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.removeHiddenThreads('a', 123)
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [
						456
					]
				}
			}
		)
		userData.removeHiddenThreads('a', 456)
		expectToEqual(
			storage.getData(),
			{}
		)
	})

	it('should merge watched threads (intersection)', () => {
		storage.setData( {
			hiddenThreads: {
				a: [
					123
				],
				b: [
					789
				]
			}
		}
		userData.merge({
			hiddenThreads: {
				a: [
					123,
					456
				],
				b: [
					790
				],
				c: [
					111,
					222
				]
			}
		})
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [
						123,
						456
					],
					b: [
						789,
						790
					],
					c: [
						111,
						222
					]
				}
			}
		)
	})

	it('should merge watched threads (no source)', () => {
		storage.setData( {
			hiddenThreads: {
				a: [123]
			}
		}
		userData.merge({})
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [123]
				}
			}
		)
	})

	it('should merge watched threads (no destination)', () => {
		storage.setData( {}
		userData.merge({
			hiddenThreads: {
				a: [123]
			}
		})
		expectToEqual(
			storage.getData(),
			{
				hiddenThreads: {
					a: [123]
				}
			}
		)
	})
})