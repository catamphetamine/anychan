export default class AttachmentSizeLimitExceededError extends Error {
	constructor() {
		super('Too many attachments')
	}
}