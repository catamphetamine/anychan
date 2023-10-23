import { encodeDate, decodeDate } from '../compression.js'

// The list of "subscribed to" threads.
//
// Users can "subscribe" to threads.
// "Subscribed to" threads are shown as a list in sidebar,
// and they also get refreshed for new comments periodically.
//
// This is a full list of "subscribed to" threads,
// containing all info about such threads: title, thumbnail, etc.
//
// Example: `subscribedThreads = [{ id: 123, ... }, { id: 456, ... }]`.
//
export default {
	name: 'subscribedThreads',
	shortName: '📑',

	// type: 'threads-list',
	type: 'list',

	// // The corresponding "index" collection for this collection.
	// index: SUBSCRIBED_THREADS_INDEX_COLLECTION_NAME,
	// getIndexCollectionMethodArgs: thread => [thread.channel.id, thread.id],

	schema: {
		id: {
			type: 'positiveInteger',
			description: 'Thread ID'
		},
		title: {
			type: 'string',
			description: 'Thread title'
		},
		channel: {
			description: 'The thread\'s channel',
			schema: {
				id: {
					type: 'string',
					description: 'Channel ID'
				},
				title: {
					type: 'string',
					description: 'Channel title',
					required: false
				}
			}
		},
		addedAt: {
			type: 'date',
			description: 'The date when the thread was added to the list of subscribed-to ones'
		},
		updatedAt: {
			type: 'date',
			description: 'The date when the thread was latest refreshed',
			required: false
		},
		archived: {
			type: 'boolean',
			description: 'Whether the thread is archived',
			required: false
		},
		archivedAt: {
			type: 'date',
			description: 'The date when the thread was archived. This property is supported by some imageboards.',
			required: false
		},
		expired: {
			type: 'boolean',
			description: 'Whether the thread is expired',
			required: false
		},
		expiredAt: {
			type: 'date',
			description: 'The date when the thread expired. This property is not supported by imageboards.',
			required: false
		},
		locked: {
			type: 'boolean',
			description: 'Whether the thread is locked',
			required: false
		},
		lockedAt: {
			type: 'date',
			description: 'The date when the thread was locked. If the data source supports this kind of a timestamp.',
			required: false
		},
		trimming: {
			type: 'boolean',
			description: 'Whether the thread is a "trimming" one. In "trimming" threads, newer comments erase older ones.',
			required: false
		},
		// latestComments: {
		// 	arrayOf: 'number',
		// 	description: 'The list of IDs of the latest comments'
		// },
		// latestReplies: {
		// 	arrayOf: 'number',
		// 	description: 'The list of IDs of the latest comments that\'re also "replies" to the user\'s own comments'
		// },
		// commentsCount: {
		// 	type: 'number',
		// 	description: 'The number of comments in the thread',
		// 	required: false
		// },
		// latestComment: {
		// 	description: 'The latest comment in the thread',
		// 	schema: {
		// 		id: {
		// 			type: 'number',
		// 			description: 'The ID of the latest comment in the thread'
		// 		},
		// 		number: {
		// 			type: 'number',
		// 			description: 'The number of the latest comment in the thread',
		// 			required: false
		// 		},
		// 		createdAt: {
		// 			type: 'date',
		// 			description: 'The date when the latest comment in the thread was created'
		// 		}
		// 	}
		// },
		thumbnail: {
			required: false,
			description: 'The thumbnail of the thread',
			schema: {
				type: {
					type: 'string',
					description: 'The image\'s MIME type'
				},
				url: {
					type: 'string',
					description: 'The URL of the image'
				},
				width: {
					type: 'positiveInteger',
					description: 'The width of the image, in pixels'
				},
				height: {
					type: 'positiveInteger',
					description: 'The height of the image, in pixels'
				},
				spoiler: {
					type: 'boolean',
					description: 'Whether the image should be hidden under a "spoiler"',
					required: false
				}
			}
		}
	},

	// These methods accept a `subscribedThread` object as an argument.
	// They don't accept `channelId` or `threadId` arguments.
	methods: {
		getSubscribedThread: ({ getFrom }) => (channelId, threadId) => {
			// Transform `channelId`/`threadId` arguments
			// into a combined argument of shape `{ id: 123, channel: { id: 'a' } }`.
			// That combined argument is then used to match a specific thread
			// using the provided `isEqual()` function for this collection.
			return getFrom({
				id: threadId,
				channel: {
					id: channelId
				}
			})
		},
		isSubscribedThread: ({ getFrom }) => (channelId, threadId) => {
			return Boolean(getFrom({
				id: threadId,
				channel: {
					id: channelId
				}
			}))
		},
		updateSubscribedThread: 'setIn',
		addSubscribedThread: 'addTo',
		removeSubscribedThread: 'removeFrom'
	},

	// `isEqual()` must be defined for collections of type "list".
	//
	// `isEqual()` is used for:
	// * Matching a record against a "primary key".
	// * Preventing the insertion of duplicate records.
	//
	// `isEqual()` should support both encoded and non-encoded records.
	//
	isEqual: (a, b) => a.id === b.id && a.channel.id === b.channel.id,

	// // When a thread is detected to be archived, mark the corresponding record
	// // in this collection as `archived: true`.
	// markAsArchived: true,

	// Remove old records when the limit is reached and new records are added.
	maxCount: 100,

	trim: (list, maxCount) => {
		while (list.length > maxCount) {
			// Remove expired items first.
			let expiredItemIndex = list.findIndex(_ => _.expired)
			if (expiredItemIndex >= 0) {
				list = list.slice(0, expiredItemIndex).concat(list.slice(expiredItemIndex + 1))
			} else {
				break
			}
		}
		return list
	},

	// Latest updated or added record overwrites the older one.
	// `a` and `b` are encoded.
	merge(a, b) {
		if (a.updatedAt) {
			if (b.updatedAt) {
				return a.updatedAt > b.updatedAt ? a : b
			}
			return a
		} else if (b.updatedAt) {
			return b
		}
		return a.addedAt > b.addedAt ? a : b
	},

	decode(data) {
		// Decode `addedAt` property.
		data.addedAt = decodeDate(data.addedAt)
		// Decode `updatedAt` property.
		if (data.updatedAt) {
			data.updatedAt = decodeDate(data.updatedAt)
		}
		// Decode `archivedAt` property.
		// `archivedAt` has been added in May 2021.
		if (data.archivedAt) {
			data.archivedAt = decodeDate(data.archivedAt)
		}
		// Decode `expiredAt` property.
		// `expiredAt` has been added on Dec 9th, 2019.
		if (data.expiredAt) {
			data.expiredAt = decodeDate(data.expiredAt)
		}
		// Decode `lockedAt` property.
		// `lockedAt` has been added in May 2021.
		if (data.lockedAt) {
			data.lockedAt = decodeDate(data.lockedAt)
		}
		// Result.
		return data
	},

	encode(data) {
		// Encode `addedAt` property.
		data.addedAt = encodeDate(data.addedAt)
		// Encode `updatedAt` property.
		if (data.updatedAt) {
			data.updatedAt = encodeDate(data.updatedAt)
		}
		// Encode `archivedAt` property.
		// `archivedAt` has been added in May 2021.
		if (data.archivedAt) {
			data.archivedAt = encodeDate(data.archivedAt)
		}
		// Encode `expiredAt` property.
		// `expiredAt` has been added on Dec 9th, 2019.
		if (data.expiredAt) {
			data.expiredAt = encodeDate(data.expiredAt)
		}
		// Encode `lockedAt` property.
		// `lockedAt` has been added in May 2021.
		if (data.lockedAt) {
			data.lockedAt = encodeDate(data.lockedAt)
		}
		// Result.
		return data
	}
}
