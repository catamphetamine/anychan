export default class DuplicateAttachmentError extends Error {
	constructor() {
		super('Duplicate attachments found')
	}
}