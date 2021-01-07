// The `version` of a user's "User Data" is stored in `version` property in `localStorage`.
// The latest version of "User Data" is `VERSION` in `UserData.js`.
export default function migrate({
	getCollectionData,
	setCollectionData,
	removeCollection,
	version
}) {
	// Version 2.
	// Dec 22, 2020.
	// Renamed `board` -> `channel`.
	if (version < 2) {
		const favoriteBoards = getCollectionData('favoriteBoards')
		if (favoriteBoards) {
			setCollectionData('favoriteChannels', favoriteBoards)
			removeCollection('favoriteBoards')
		}
	}
}

export function migrateCollectionData({ key, data, version = 0 }) {
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
			// Version 2.
			// Dec 22, 2020.
			// Renamed `board` -> `channel`.
			if (version < 2) {
				for (const thread of data) {
					thread.channel = thread.board
					delete thread.board
				}
			}
			break

		case 'latestReadComments':
			// Version 1.
			// Dec 24, 2019.
			// Converted `latestReadComments` from comment id to an object of shape:
			// `{ id, i, updatedAt?, threadUpdatedAt?, commentsCount }`.
			if (version < 1) {
				for (const channelId of Object.keys(data)) {
					for (const threadId of Object.keys(data[channelId])) {
						const id = data[channelId][threadId]
						data[channelId][threadId] = {
							id,
							i: 0
						}
					}
				}
			}
			// Version 3.
			// Jan 07, 2021.
			// Clean up unused `t` and `threadUpdatedAt` timestamps,
			// that also have been corrupted in some cases (`null`, `NaN`).
			// So, `latestReadComments` shape is now `{ id, i }`.
			if (version < 3) {
				for (const channelId of Object.keys(data)) {
					for (const threadId of Object.keys(data[channelId])) {
						delete data[channelId][threadId].t
						delete data[channelId][threadId].threadUpdatedAt
					}
				}
			}
			break
	}
}