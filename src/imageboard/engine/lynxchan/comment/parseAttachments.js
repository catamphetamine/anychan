import parseAttachment, { getPictureTypeFromUrl, guessFileUrlFromThumbnailUrl } from './parseAttachment'

export default function parseAttachments(post, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	toAbsoluteUrl
}) {
	let files = post.files
	let isLynxChanCatalogAttachmentsBug
	// In `/catalog.json` API response there're no `files`, only `thumb` property, which is a bug.
	// http://lynxhub.com/lynxchan/res/722.html#q984
	if (!files) {
		if (post.thumb) {
			isLynxChanCatalogAttachmentsBug = true
			files = [{
				// A stub for the absent `files` bug in `/catalog.json` API response.
				// http://lynxhub.com/lynxchan/res/722.html#q984
				mime: getPictureTypeFromUrl(post.thumb, chan),
				// `lynxchan` doesn't provide `width` and `height`
				// neither for the picture not for the thumbnail
				// in `/catalog.json` API response (which is a bug).
				// http://lynxhub.com/lynxchan/res/722.html#q984
				// `width` and `height` are set later when the image is loaded.
				width: thumbnailSize,
				height: thumbnailSize,
				// Even if `path` URL would be derived from `thumb` URL
				// the `width` and `height` would still be unspecified.
				// path: post.thumb,
				path: guessFileUrlFromThumbnailUrl(post.thumb, chan),
				thumb: post.thumb,
				originalName: '[stub]'
			}]
		} else {
			files = []
		}
	}
	if (files.length > 0) {
		files = files.map((file) => parseAttachment(file, {
			chan,
			boardId,
			attachmentUrl,
			attachmentThumbnailUrl,
			thumbnailSize,
			toAbsoluteUrl
		}))
		if (isLynxChanCatalogAttachmentsBug) {
			files[0].isLynxChanCatalogAttachmentsBug = true
		}
		return files
	}
}