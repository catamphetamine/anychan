// The latest date when the latest User Data clean up has finished.
// (in milliseconds).
//
// Example: `cleanUpFinishedAt = 1234567890`.
//
export default {
	name: 'cleanUpFinishedAt',
	shortName: null,

	type: 'value',

	schema: {
		type: 'number',
		description: 'The timestamp of the latest date when User Data clean up has been finished'
	},

	// Later clean-up "finished at" date overwrites an earlier one.
	merge: (a, b) => a > b ? a : b
}