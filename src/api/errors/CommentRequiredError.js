export default class CommentRequiredError extends Error {
	constructor() {
		super('Comment content is required')
	}
}