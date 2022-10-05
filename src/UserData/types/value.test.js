// Currently, there seem to be no "value"-type collections.
// So this test is not included.

import UserData from '../UserData.js'
import { MemoryStorage } from 'web-browser-storage'

function create() {
	const collections = {
		value: {
			name: 'value',
			shortName: null,
			type: 'value',
			schema: {
				type: 'number',
				description: 'Number'
			},
			// Larger value overwrites a smaller one.
			merge: (a, b) => a > b ? a : b
		}
	}

	const storage = new MemoryStorage()

	const userData = new UserData(storage, { collections })

	return { storage, userData }
}

describe('UserData', () => {
	it('should add/remove/get value', () => {
		const { storage, userData } = create()
		userData.setValue(123456789)
		expectToEqual(
			userData.get(),
			{
				value: 123456789
			}
		)
		userData.setValue(123456790)
		expectToEqual(
			userData.get(),
			{
				value: 123456790
			}
		)
		expectToEqual(
			userData.getValue(),
			123456790
		)
		userData.removeValue()
		expectToEqual(
			userData.get(),
			{}
		)
	})

	it('should merge values (newer value overrides older value)', () => {
		const { storage, userData } = create()
		userData.replace({
			value: 123
		})
		userData.merge({
			value: 456
		})
		expectToEqual(
			userData.get(),
			{
				value: 456
			}
		)
	})

	it('should merge values (newer value doesn\'t override older value)', () => {
		const { storage, userData } = create()
		userData.replace({
			value: 123
		})
		userData.merge({
			value: 23
		})
		expectToEqual(
			userData.get(),
			{
				value: 123
			}
		)
	})
})