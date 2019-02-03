import Parser from '../Parser'

export default class FourChanParser extends Parser {
	constructor(options) {
		super({
			...options,
			getAttachmentUrl(path, { boardId }) {
				return `https://i.4cdn.org/${boardId}${path}`
			}
		})
	}
}