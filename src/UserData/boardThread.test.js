import { describe, it } from 'webapp-frontend/src/utility/mocha'
import expectToEqual from 'webapp-frontend/src/utility/expectToEqual'

import { UserData } from './UserData'
import MemoryStorage from 'webapp-frontend/src/utility/MemoryStorage'

const storage = new MemoryStorage()
const userData = new UserData(storage)
userData.prefix = ''

describe('UserData', () => {
	it('should add/remove/get watched threads', () => {
		storage.clear()
		userData.addHiddenThreads('a', 123)
		expectToEqual(
			storage.data,
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
			storage.data,
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
			storage.data,
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
			storage.data,
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
			storage.data,
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
			storage.data,
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
			storage.data,
			{}
		)
	})

	it('should merge watched threads (intersection)', () => {
		storage.data = {
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
			storage.data,
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
		storage.data = {
			hiddenThreads: {
				a: [123]
			}
		}
		userData.merge({})
		expectToEqual(
			storage.data,
			{
				hiddenThreads: {
					a: [123]
				}
			}
		)
	})

	it('should merge watched threads (no destination)', () => {
		storage.data = {}
		userData.merge({
			hiddenThreads: {
				a: [123]
			}
		})
		expectToEqual(
			storage.data,
			{
				hiddenThreads: {
					a: [123]
				}
			}
		)
	})
})