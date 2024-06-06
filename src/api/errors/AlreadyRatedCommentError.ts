export class AlreadyRatedCommentError extends Error {
	constructor() {
		super('You\'ve already rated this comment')
	}
}