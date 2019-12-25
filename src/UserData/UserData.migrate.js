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
	}
}