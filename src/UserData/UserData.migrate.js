export default function migrate(key, data, version = 0) {
	switch (key) {
		case 'trackedThreadsList':
			// Version 1.
			// Dec 24, 2019.
			// Added `trackedThreadsList.expiredAt`.
			if (version < 1) {
				for (const thread of data) {
					if (thread.expired && !thread.expiredAt) {
						thread.expiredAt = Date.now()
					}
				}
			}
			break

		case 'latestReadComments':
			// Version 1.
			// Dec 24, 2019.
			// Converted `latestReadComments` from comment id to an object of shape:
			// `{ id, no, createdAt, updatedAt?, threadUpdatedAt?, commentsCount }`.
			if (version < 1) {
				for (const boardId of Object.keys(data)) {
					for (const threadId of Object.keys(data[boardId])) {
						const id = data[boardId][threadId]
						data[boardId][threadId] = {
							id,
							i: 0,
							last: false
						}
					}
				}
			}
			break
	}
}