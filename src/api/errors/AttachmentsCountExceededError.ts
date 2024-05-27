export default class AttachmentsCountExceededError extends Error {
	constructor() {
		super('Too many attachments')
	}
}