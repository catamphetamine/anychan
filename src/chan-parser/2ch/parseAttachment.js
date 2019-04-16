import getMimeType from 'webapp-frontend/src/utility/getMimeType'

const STICKER_FILE_TYPE = 100
const ORIGIN = 'https://2ch.hk'

export default function parseAttachment(file, { useRelativeUrls }) {
	// `2ch` runs on multiple domains in case one of them is blocked.
	// (2ch.hk, 2ch.so, 2ch.pm, 2ch.yt, 2ch.wf, 2ch.re).
	// By using relative URLs in case of running on an "official" domain
	// attachment URLs will keep working if `2ch.hk` domain is blocked.
	const origin = useRelativeUrls ? '' : ORIGIN
	const mimeType = getContentTypeByFileType(file.type) ||
		// Fallback for incorrect attachments.
		// (there were some cases supposedly in old threads)
		getMimeType(file.path)
	if (mimeType && mimeType.indexOf('image/') === 0) {
		return parsePicture(file, mimeType, origin)
	}
	if (mimeType && mimeType.indexOf('video/') === 0) {
		return parseVideo(file, mimeType, origin)
	}
	// `2ch.hk` doesn't allow attaching audio files
	// but just in case such feature is added in some future.
	if (mimeType && mimeType.indexOf('audio/') === 0) {
		return parseAudio(file, mimeType, origin)
	}
	return parseFile(file, mimeType, origin)
}

function parsePicture(file, mimeType, origin) {
	const attachment = {
		type: 'picture',
		picture: {
			type: mimeType,
			width: file.width,
			height: file.height,
			size: file.size * 1024, // in bytes
			url: `${origin}${file.path}`,
			sizes: [{
				type: getMimeType(file.thumbnail),
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

function parseVideo(file, mimeType, origin) {
	return {
		type: 'video',
		video: {
			type: mimeType,
			// Sometimes (very rarely) on `2ch.hk` `.webm`s have negative duration.
			// Example:
			// {
			//   displayname: "6.4.webm",
			//   duration: "0-2562047788:00:0-54",
			//   duration_secs: -2077252342,
			//   ...
			// }
			duration: file.duration_secs >= 0 ? file.duration_secs : 0,
			width: file.width,
			height: file.height,
			size: file.size * 1024, // in bytes
			url: `${origin}${file.path}`,
			picture: {
				type: getMimeType(file.thumbnail),
				width: file.tn_width,
				height: file.tn_height,
				url: `${origin}${file.thumbnail}`
			}
		}
	}
}

function parseAudio(file, mimeType, origin) {
	const [name, ext] = splitFilename(file.fullname)
	return {
		type: 'audio',
		audio: {
			type: mimeType,
			title: name,
			url: `${origin}${file.path}`
		}
	}
}

function parseFile(file, mimeType, origin) {
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