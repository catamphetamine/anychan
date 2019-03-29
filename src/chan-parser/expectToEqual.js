import isEqual from 'lodash/isEqual'

export default function expectToEqual(actual, expected) {
	if (!isEqual(actual, expected)) {
		const actualJSON = JSON.stringify(actual, null, 2)
		const expectedJSON = JSON.stringify(expected, null, 2)
		if (!isEqual(Object.keys(actual).sort(), Object.keys(expected).sort())) {
			console.log('Actual root-level keys:', Object.keys(actual).sort())
			console.log('Expected root-level keys:', Object.keys(expected).sort())
		} else {
			console.log('Actual and Expected produce identical JSON strings but some properties are different. Usually those are some unnecessary "undefined" properties somewhere in nested objects which don\'t get printed. Check "Object.keys()" output for the suspected nested objects in Actual and Expected to find the stray empty properties. Sometimes it can also be some javascript objects which get printed to a string (like "Date"s) with one of the compared objects containing those javascript objects and the other containing stringified representations of those.')
		}
		console.log('Actual', actualJSON)
		console.log('Expected', expectedJSON)
		throw new Error('Expected to equal')
	}
}
