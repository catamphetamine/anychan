import isEqual from 'lodash/isEqual'

export default function expectToEqual(actual, expected) {
	if (!isEqual(actual, expected)) {
		const actualJSON = JSON.stringify(actual, null, 2)
		const expectedJSON = JSON.stringify(expected, null, 2)
		if (actualJSON === expectedJSON) {
			console.log('Actual and Expected produce identical JSON strings but some properties are different. Usually those are some unnecessary "undefined" properties which don\'t get printed. Check "Object.keys()" output for Actual and Expected children to find the stray empty properties.')
		}
		if (!isEqual(Object.keys(actual).sort(), Object.keys(expected).sort())) {
			console.log('Actual root-level keys:', Object.keys(actual))
			console.log('Expected root-level keys:', Object.keys(expected))
		}
		console.log('Actual', actualJSON)
		console.log('Expected', expectedJSON)
		throw new Error('Expected to equal')
	}
}
