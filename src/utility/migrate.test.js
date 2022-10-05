import migrate from './migrate.js'
import * as COLLECTIONS from '../UserData/collections/index.js'

import { MemoryStorage } from 'web-browser-storage'

describe('migrate', function() {
	it('should migrate initial data', function() {
		const storage = new MemoryStorage()

		storage.setData({
			'unrelated.key': 'value',
			'captchan.threads': { a: { id: 123, title: "Anime" } },
			'captchan.favoriteChannels': [{ id: "a", title: "Anime" }],
			'captchan.announcement': { content: "Abc" },
			'captchan.someOtherCollection': '...',
			'captchan.version': 1,
			'captchan.4chan.favoriteChannels': [{ id: "a", title: "Anime" }],
			'captchan.4chan.someOtherCollection': '...',
			'captchan.4chan.version': 1
		})

		migrate({
			collections: COLLECTIONS,
			storage
		})

		expectToEqual(
			storage.getData(),
			{
				'unrelated.key': 'value',
				'⌨️': { version : 1 },
				'⌨️📖': { a: { id: 123, title: "Anime" } },
				'⌨️📚': [{ id: "a", title: "Anime" }],
				'⌨️announcement': { content: "Abc" },
				'⌨️someOtherCollection': '...',
				'⌨️version': 1,
				'⌨️🍀📚': [{ id: "a", title: "Anime" }],
				'⌨️🍀someOtherCollection': '...',
				'⌨️🍀version': 1
			}
		)
	})
})