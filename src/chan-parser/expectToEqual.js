import isEqual from 'lodash/isEqual'

export default function expectToEqual(actual, expected) {
	if (!isEqual(actual, expected)) {
		console.log('Actual', JSON.stringify(actual, null, 2))
		console.log('Expected', JSON.stringify(expected, null, 2))
		throw new Error('Expected to equal')
	}
}
