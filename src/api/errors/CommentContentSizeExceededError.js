export default class CommentContentSizeExceededError extends Error {
	constructor() {
		super('Comment content size exceeded')
	}
}