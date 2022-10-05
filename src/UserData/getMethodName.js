const OPERATION_METHOD_PREFIXES = {
	// Collection data operations:
	get: 'get',
	set: 'set',
	remove: 'remove',
	mergeWith: 'mergeWith',

	// Item operations:
	getFrom: 'getFrom',
	addTo: 'addTo',
	setIn: 'setIn',
	removeFrom: 'removeFrom'
}

export default function getMethodName(operation, collectionName) {
	if (!OPERATION_METHOD_PREFIXES[operation]) {
		throw new Error(`Operation "${operation}" not found when getting method name for collection "${collectionName}"`)
	}
	return `${OPERATION_METHOD_PREFIXES[operation]}${capitalize(collectionName)}`
}

function capitalize(string) {
	return string[0].toUpperCase() + string.slice(1)
}
