export default class AttachmentRequiredError extends Error {
	constructor() {
		super('Attachment is required')
	}
}