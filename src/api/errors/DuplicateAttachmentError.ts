export class DuplicateAttachmentError extends Error {
	constructor() {
		super('Duplicate attachments found')
	}
}