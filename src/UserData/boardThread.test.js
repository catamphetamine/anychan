import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from '../utility/MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('UserData', () => {
	it('should add/remove/get watched threads', () => {
		storage.clear()
		userData.addWatchedThreads('a', 123)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123
					]
				}
			}
		)
		userData.addWatchedThreads('a', 456)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.addWatchedThreads('b', 789)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
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
			userData.getWatchedThreads(),
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
			userData.getWatchedThreads('a'),
			[
				123,
				456
			]
		)
		expectToEqual(
			userData.getWatchedThreads('c'),
			[]
		)
		expectToEqual(
			userData.getWatchedThreads('a', 123),
			true
		)
		expectToEqual(
			userData.getWatchedThreads('a', 789),
			false
		)
		expectToEqual(
			userData.getWatchedThreads('c', 111),
			false
		)
		userData.removeWatchedThreads('b')
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.removeWatchedThreads('b', 789)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						123,
						456
					]
				}
			}
		)
		userData.removeWatchedThreads('a', 123)
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [
						456
					]
				}
			}
		)
		userData.removeWatchedThreads('a', 456)
		expectToEqual(
			storage.data,
			{}
		)
	})

	it('should merge watched threads (intersection)', () => {
		storage.data = {
			watchedThreads: {
				a: [
					123
				],
				b: [
					789
				]
			}
		}
		userData.merge({
			watchedThreads: {
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
			storage.data,
			{
				watchedThreads: {
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
		storage.data = {
			watchedThreads: {
				a: [123]
			}
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [123]
				}
			}
		)
	})

	it('should merge watched threads (no destination)', () => {
		storage.data = {}
		userData.merge({
			watchedThreads: {
				a: [123]
			}
		})
		expectToEqual(
			storage.data,
			{
				watchedThreads: {
					a: [123]
				}
			}
		)
	})
})