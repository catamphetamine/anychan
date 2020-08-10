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

describe('UserData', () => {
	it('should add/remove/get seen threads', () => {
		storage.clear()
		userData.addLatestSeenThreads('a', 123)
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
		userData.addLatestSeenThreads('a', 456)
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {
					a: 456
				}
			}
		)
		userData.addLatestSeenThreads('b', 789)
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {
					a: 456,
					b: 789
				}
			}
		)
		expectToEqual(
			userData.getLatestSeenThreads(),
			{
				a: 456,
				b: 789
			}
		)
		expectToEqual(
			userData.getLatestSeenThreads('b', 789),
			true
		)
		expectToEqual(
			userData.getLatestSeenThreads('b', 790),
			false
		)
		expectToEqual(
			userData.getLatestSeenThreads('a'),
			123
		)
		expectToEqual(
			userData.getLatestSeenThreads('c'),
			{}
		)
		expectToEqual(
			userData.getLatestSeenThreads('c', 111),
			false
		)
		userData.removeSeenThreads('b')
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
		userData.removeSeenThreads('a', 124)
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
		userData.removeSeenThreads('a', 123)
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {}
			}
		)
	})

	it('should merge seen threads', () => {
		storage.data = {
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
			storage.data,
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
		storage.data = {}
		userData.merge({
			latestSeenThreads: {
				a: 123
			}
		})
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
	})

	it('should merge seen threads (destination not exists)', () => {
		storage.data = {
			latestSeenThreads: {
				a: 123
			}
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				latestSeenThreads: {
					a: 123
				}
			}
		)
	})
})