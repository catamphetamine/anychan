import Parser from '../Parser'

export default class DvachParser extends Parser {
	constructor(options) {
		super({
			...options,
			getAttachmentUrl(path, { boardId }) {
				return `https://2ch.hk${path}`
			}
		})
	}
}