import { getMimeTypeByFileName } from '../parseAttachment'

const STICKER_FILE_TYPE = 100

const ORIGIN = 'https://2ch.hk'

function getContentTypeByFileType(type) {
	switch (type) {
		case 1:
			return 'image/jpeg'
		case 2:
			return 'image/png'
		case 4:
			return 'image/gif'
		case 6:
			return 'video/webm'
		case 10:
			return 'video/mp4'
		// Stickers.
		case STICKER_FILE_TYPE:
			return 'image/png'
	}
}

export default function parseAttachment(file, { useRelativeUrls }) {
	// `2ch` runs on multiple domains in case one of them is blocked.
	// (2ch.hk, 2ch.so, 2ch.pm, 2ch.yt, 2ch.wf, 2ch.re).
	// By using relative URLs in case of running on an "official" domain
	// attachment URLs will keep working if `2ch.hk` domain is blocked.
	const origin = useRelativeUrls ? '' : ORIGIN
	let mimeType = getContentTypeByFileType(file.type)
	// Fallback for incorrect attachments.
	// (there were some cases supposedly in old threads)
	if (!mimeType) {
		mimeType = getMimeTypeByFileName(file.path)
	}
	if (mimeType && mimeType.indexOf('image/') === 0) {
		const attachment = {
			type: 'picture',
			picture: {
				type: mimeType,
				width: file.width,
				height: file.height,
				size: file.size * 1024, // in bytes
				url: `${origin}${file.path}`,
				sizes: [{
					type: getMimeTypeByFileName(file.thumbnail),
					width: file.tn_width,
					height: file.tn_height,
					url: `${origin}${file.thumbnail}`
				}]
			}
		}
		if (file.type === STICKER_FILE_TYPE) {
			attachment.picture.transparent = true
			// // A link to a page with "Add this sticker to your library" button.
			// // Example: "/makaba/stickers/show/DJfQnwJM".
			// ....installStickerLink = `${origin}${file.install}`
		}
		return attachment
	}
	if (mimeType && mimeType.indexOf('video/') === 0) {
		return {
			type: 'video',
			video: {
				type: mimeType,
				duration: file.duration_secs,
				width: file.width,
				height: file.height,
				size: file.size * 1024, // in bytes
				url: `${origin}${file.path}`,
				picture: {
					type: getMimeTypeByFileName(file.thumbnail),
					width: file.tn_width,
					height: file.tn_height,
					url: `${origin}${file.thumbnail}`
				}
			}
		}
	}
	const [name, ext] = splitFilename(file.fullname)
	return {
		type: 'file',
		file: {
			type: mimeType,
			name,
			ext,
			size: file.size * 1024, // in bytes
			width: file.width,
			height: file.height,
			url: `${origin}${file.path}`
		}
	}
}

function splitFilename(filename) {
	const dotIndex = filename.lastIndexOf('.')
	if (dotIndex > 0 || dotIndex < filename.length - 1) {
		return [
			filename.slice(0, dotIndex),
			filename.slice(dotIndex)
		]
	}
	return [filename, undefined]
}