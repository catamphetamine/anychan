// When there're nested `for of` cycles,
// `Array.find()` is slow for calling it a lot of times over and over.
// A "by id" index is much faster in cases when there're nested `for of` cycles.
export default function createByIdIndex<Id = any, Object extends { id: Id } = Record<'id', Id> & object>(
	objects: Object[],
	getId: (object: Object) => Id = (object => object.id)
) {
	const index: Record<string, Object> = {}
	for (const object of objects) {
		const id = getId(object)
		index[String(id)] = object
	}
	return function(id: Id) {
		if (typeof id === 'string') {
			return index[id]
		} else {
			return index[String(id)]
		}
	}
}