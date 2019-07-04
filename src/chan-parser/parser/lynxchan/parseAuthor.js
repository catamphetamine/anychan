export default function parseAuthor(name, { defaultAuthorName, boardId }) {
	if (defaultAuthorName) {
		if (typeof defaultAuthorName === 'object') {
			if (defaultAuthorName[boardId]) {
				if (is(name, defaultAuthorName[boardId])) {
					return
				}
			}
			if (defaultAuthorName['*']) {
				if (is(name, defaultAuthorName['*'])) {
					return
				}
			}
		} else if (is(name, defaultAuthorName)) {
			return
		}
	}
	return name
}

function is(name, defaultAuthorName) {
	// if (Array.isArray(defaultAuthorName)) {
	// 	return defaultAuthorName.indexOf(name) >= 0
	// }
	return defaultAuthorName === name
}