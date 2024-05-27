import type { UserDataCollection } from '@/types'

// The latest "announcement" banner data.
//
// The latest announcement is saved in User Data.
// After it has been read, it's marked as `read: true`.
//
// Example: `announcement = { date: "2012-12-21T00:00:00.000Z", content: "..." }`.
// Example: `announcement = { date: "2012-12-21T00:00:00.000Z", content: "...", read: true }`.
//
export const announcement: UserDataCollection = {
	name: 'announcement',
	shortName: null,

	type: 'value',

	schema: {
		date: {
			type: 'string',
			description: 'The date of the announcement',
			example: '2012-12-21T00:00:00.000Z'
		},
		content: {
			description: 'The announcement content. See `Content` type of `social-components` package: https://gitlab.com/catamphetamine/social-components/blob/master/docs/Content.md',
			oneOfType: [
				{
					is: 'string',
					type: 'string',
					description: 'Text'
				},
				{
					is: 'any[]',
					description: 'Content',
					arrayOf: {
						oneOfType: [
							{
								is: 'string',
								type: 'string',
								description: 'Text'
							},
							{
								is: 'object',
								description: 'Object',
								schema: {}
							},
							{
								is: 'any[]',
								arrayOf: {
									oneOfType: [
										{
											is: 'string',
											type: 'string',
											description: 'Text'
										},
										{
											is: 'object',
											description: 'Object',
											schema: {}
										}
									]
								}
							}
						]
					}
				}
			]
		},
		read: {
			type: 'boolean',
			description: 'When the announcement has been "read" by the user, the `read` flag is set to `true`.',
			required: false
		}
	},

	// Later announcement overwrites an earlier one.
	// `a` and `b` are encoded.
	merge: (a, b) => new Date(a.date).getTime() > new Date(b.date).getTime() ? a : b
}