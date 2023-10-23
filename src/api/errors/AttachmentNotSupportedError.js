export default class AttachmentNotSupportedError extends Error {
	constructor() {
		super('Unsupported attachments found')
	}
}