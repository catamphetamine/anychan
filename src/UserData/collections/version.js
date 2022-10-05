// User Data version.
export default {
	name: 'version',
	shortName: null,

	type: 'value',

	schema: {
		type: 'positiveInteger',
		description: 'User Data Version'
	},

	merge: (a, b) => a > b ? a : b
}
