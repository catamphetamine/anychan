import UserData from './UserData.js'
import { MemoryStorage } from 'web-browser-storage'

describe('UserData', () => {
	it('should add to / remove from index when adding to / removing from data collection', () => {
		const storage = new MemoryStorage()
		const userData = new UserData(storage)

		userData.addSubscribedThread({
			id: 123,
			title: 'Anime 1',
			channel: { id: 'a' },
			addedAt: new Date(1000)
		})

		userData.addSubscribedThread({
			id: 456,
			title: 'Anime 2',
			channel: { id: 'a' },
			addedAt: new Date(1000)
		})

		userData.addSubscribedThread({
			id: 789,
			title: 'Random',
			channel: { id: 'b' },
			addedAt: new Date(1000)
		})

		userData.addSubscribedThreadIdForChannel('a', 123)
		userData.addSubscribedThreadIdForChannel('a', 456)
		userData.addSubscribedThreadIdForChannel('b', 789)

		expectToEqual(
			userData.get(),
			{
				subscribedThreadsIndex: {
					a: [
						123,
						456
					],
					b: [
						789
					]
				},
				subscribedThreads: [
					{
						id: 123,
						title: 'Anime 1',
						channel: {
							id: 'a'
						},
						addedAt: 1
					},
					{
						id: 456,
						title: 'Anime 2',
						channel: {
							id: 'a'
						},
						addedAt: 1
					},
					{
						id: 789,
						title: 'Random',
						channel: {
							id: 'b'
						},
						addedAt: 1
					}
				]
			}
		)

		userData.removeSubscribedThread({
			id: 123,
			channel: {
				id: 'a'
			}
		})

		userData.removeSubscribedThreadIdFromChannel('a', 123)

		expectToEqual(
			userData.get(),
			{
				subscribedThreadsIndex: {
					a: [
						456
					],
					b: [
						789
					]
				},
				subscribedThreads: [
					{
						id: 456,
						title: 'Anime 2',
						channel: {
							id: 'a'
						},
						addedAt: 1
					},
					{
						id: 789,
						title: 'Random',
						channel: {
							id: 'b'
						},
						addedAt: 1
					}
				]
			}
		)
	})
})