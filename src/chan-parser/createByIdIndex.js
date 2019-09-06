// When there're nested `for of` cycles,
// `Array.find()` is slow for calling it a lot of times over and over.
// A "by id" index is much faster in cases when there're nested `for of` cycles.
export default function createByIdIndex(objects, getId = object => object.id) {
	const index = {}
	let isStringId
	for (const object of objects) {
		const id = getId(object)
		if (isStringId === undefined) {
			isStringId = typeof id === 'string'
		}
		if (isStringId) {
			index[id] = object
		} else {
			index[String(id)] = object
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