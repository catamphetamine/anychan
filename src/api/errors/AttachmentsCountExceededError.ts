export class AttachmentsCountExceededError extends Error {
	constructor() {
		super('Too many attachments')
	}
}