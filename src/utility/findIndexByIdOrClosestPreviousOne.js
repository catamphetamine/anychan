/**
 * Finds an item's index, or, if the item has been deleted,
 * returns the index of the closest previous one (if any).
 * @param  {object[]} items
 * @param  {number} id
 * @return {number} [i] Returns `undefined` if no appropriate match was found.
 */
export default function findIndexByIdOrClosestPreviousOne(objects, id, getObjectId = getObjectId_) {
	// Find latest read comment index.
	let i = objects.length - 1
	while (i >= 0) {
		// A comment might have been deleted,
		// in which case find the closest previous one.
		if (getObjectId(objects[i]) <= id) {
			return i
		}
		i--
	}
}

function getObjectId_(object) {
	return object.id
}