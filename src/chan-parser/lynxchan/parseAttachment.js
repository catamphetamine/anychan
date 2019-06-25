import getMimeType from '../utility/getMimeType'
import splitFilename from '../utility/splitFilename'

export default function parseAttachment(file, options) {
	const [name] = splitFilename(file.originalName)
	const mimeType = file.mime
	if (mimeType && mimeType.indexOf('image/') === 0) {
		return parsePicture(file, mimeType, name, options)
	}
	if (mimeType && mimeType.indexOf('video/') === 0) {
		return parseVideo(file, mimeType, name, options)
	}
	// `kohlchan.net` may theoretically support attaching audio files.
	if (mimeType && mimeType.indexOf('audio/') === 0) {
		return parseAudio(file, mimeType, name, options)
	}
	return parseFile(file, mimeType, name, options)
}

function parsePicture(file, mimeType, name, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'picture', chan)
	return {
		type: 'picture',
		picture: {
			// Most of the times users would prefer not disclosing the actual file name.
			// title: name,
			type: mimeType,
			width: file.width,
			height: file.height,
			size: file.size, // in bytes
			url: formatUrl(attachmentUrl, file.path),
			sizes: [{
				type: getMimeType(thumbnailExt),
				...getThumbnailSize(file.width, file.height),
				url: formatUrl(attachmentThumbnailUrl, file.thumb)
			}]
		}
	}
}

function parseVideo(file, mimeType, name, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'video', chan)
	return {
		type: 'video',
		video: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: name,
			width: file.width,
			height: file.height,
			size: file.size, // in bytes
			url: formatUrl(attachmentUrl, file.path),
			picture: {
				type: getMimeType(thumbnailExt),
				...getThumbnailSize(file.width, file.height),
				url: formatUrl(attachmentThumbnailUrl, file.thumb)
			}
		}
	}
}

function parseAudio(file, mimeType, name, {
	boardId,
	attachmentUrl
}) {
	return {
		type: 'audio',
		audio: {
			type: mimeType,
			title: name,
			url: formatUrl(attachmentUrl, file.path)
		}
	}
}

function parseFile(file, mimeType, name, {
	boardId,
	attachmentUrl
}) {
	const [_unused, ext] = splitFilename(file.path)
	return {
		type: 'file',
		file: {
			type: mimeType,
			name,
			ext,
			size: file.size, // in bytes
			url: formatUrl(attachmentUrl, file.path)
		}
	}
}

function formatUrl(url, path) {
	return url.replace(/{url}/, path)
}

// `kohlchan.net` has thumbnail size `200`.
// Could be read from a config file.
function getThumbnailSize(width, height, maxSize = 200) {
	if (width >= height) {
		return {
			width: maxSize,
			height: maxSize * height / width
		}
	} else {
		return {
			width: maxSize * width / height,
			height: maxSize
		}
	}
}

function getThumbnailExt(file, type, chan) {
	// Assume that all videos have ".jpg" thumbnails (makes sense).
	if (type === 'video') {
		return '.jpg'
	}
	// `kohlchan.net` always has ".png" extension for thumbnails.
	if (chan === 'kohlchan') {
		return '.png'
	}
	return '.unknown-extension'
}