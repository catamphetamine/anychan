export default function parseAuthor(name, { defaultAuthorName, boardId }) {
	// `name` can be `undefined` (property not present in `lynxchan` API response).
	if (!name) {
		return
	}
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
	// `kohlchan.net` trip code example:
	// "Bernd <span style='font-weight: normal;'>!Laura.5zo2</span>"
	const tripCodeMatch = name.match(TRIP_CODE_REG_EXP)
	if (tripCodeMatch) {
		return {
			name: name.slice(0, name.indexOf(tripCodeMatch[0])),
			tripCode: tripCodeMatch[1]
		}
	}
	return {
		name
	}
}

const TRIP_CODE_REG_EXP = / <span style='font-weight: normal;'>(.+)<\/span>$/

function is(name, defaultAuthorName) {
	// if (Array.isArray(defaultAuthorName)) {
	// 	return defaultAuthorName.indexOf(name) >= 0
	// }
	return defaultAuthorName === name
}