// When there're nested `for of` cycles,
// `Array.find()` is slow for calling it a lot of times over and over.
// A "by id" index is much faster in cases when there're nested `for of` cycles.
export default function createByIdIndex(objects) {
	const index = {}
	let isStringId
	for (const object of objects) {
		if (isStringId === undefined) {
			isStringId = typeof object.id === 'string'
		}
		if (isStringId) {
			index[object.id] = object
		} else {
			index[String(object.id)] = object
		}
	}
	return function(id) {
		if (typeof id === 'string') {
			return index[id]
		} else {
			return index[String(id)]
		}
	}
}