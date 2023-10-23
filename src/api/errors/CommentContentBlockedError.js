export default class CommentContentBlockedError extends Error {
	constructor() {
		super('Comment contains blacklisted content')
	}
}