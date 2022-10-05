import UserData from '../UserData'
import { MemoryStorage } from 'web-browser-storage'

function create() {
	const storage = new MemoryStorage()
	const userData = new UserData(storage)
	return { storage, userData }
}

describe('UserData', () => {
	it('should add/remove/get seen threads', () => {
		const { storage, userData } = create()
		userData.setLatestSeenThreadId('a', 123)
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
		userData.setLatestSeenThreadId('a', 456)
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 456
				}
			}
		)
		userData.setLatestSeenThreadId('b', 789)
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 456,
					b: 789
				}
			}
		)
		expectToEqual(
			userData.get().latestSeenThreads,
			{
				a: 456,
				b: 789
			}
		)
		expectToEqual(
			userData.getLatestSeenThreadId('b', 789),
			true
		)
		expectToEqual(
			userData.getLatestSeenThreadId('b', 790),
			false
		)
		expectToEqual(
			userData.getLatestSeenThreadId('a'),
			123
		)
		expectToEqual(
			userData.getLatestSeenThreadId('c'),
			{}
		)
		expectToEqual(
			userData.getLatestSeenThreadId('c', 111),
			false
		)
		userData.removeSeenThreads('b')
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
		userData.removeSeenThreads('a', 124)
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
		userData.removeSeenThreads('a', 123)
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {}
			}
		)
	})

	it('should merge seen threads', () => {
		storage.setData( {
			latestSeenThreads: {
				a: 123,
				c: 888
			}
		}
		userData.merge({
			latestSeenThreads: {
				a: 124,
				b: 789
			}
		})
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 124,
					b: 789,
					c: 888
				}
			}
		)
	})

	it('should merge seen threads (source not exists)', () => {
		storage.setData( {}
		userData.merge({
			latestSeenThreads: {
				a: 123
			}
		})
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
	})

	it('should merge seen threads (destination not exists)', () => {
		storage.setData( {
			latestSeenThreads: {
				a: 123
			}
		}
		userData.merge({})
		expectToEqual(
			storage.getData(),
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
	})
})