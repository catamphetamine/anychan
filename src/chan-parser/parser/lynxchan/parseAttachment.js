import getMimeType, { getExtension } from '../../utility/getMimeType'
import splitFilename from '../../utility/splitFilename'

export default function parseAttachment(file, options) {
	options = {
		...options,
		toAbsoluteUrl: url => toAbsoluteUrl(url, options)
	}
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
	attachmentThumbnailUrl,
	thumbnailSize,
	toAbsoluteUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'picture', chan)
	const picture = {
		// Most of the times users would prefer not disclosing the actual file name.
		// title: name,
		type: mimeType,
		width: file.width,
		height: file.height,
		url: toAbsoluteUrl(formatUrl(attachmentUrl, file.path)),
		sizes: [{
			type: getMimeType(thumbnailExt),
			...getThumbnailSize(file.width, file.height, thumbnailSize),
			url: toAbsoluteUrl(formatUrl(attachmentThumbnailUrl, file.thumb))
		}]
	}
	// `lynxchan` doesn't provide thumbnail `size`
	// in a `/catalog.json` API respoinse.
	if (file.size !== undefined) {
		picture.size = file.size // in bytes
	}
	return {
		type: 'picture',
		picture
	}
}

function parseVideo(file, mimeType, name, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	thumbnailSize,
	toAbsoluteUrl
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
			url: toAbsoluteUrl(formatUrl(attachmentUrl, file.path)),
			picture: {
				type: getMimeType(thumbnailExt),
				...getThumbnailSize(file.width, file.height, thumbnailSize),
				url: toAbsoluteUrl(formatUrl(attachmentThumbnailUrl, file.thumb))
			}
		}
	}
}

function parseAudio(file, mimeType, name, {
	boardId,
	attachmentUrl,
	toAbsoluteUrl
}) {
	return {
		type: 'audio',
		audio: {
			type: mimeType,
			title: name,
			url: toAbsoluteUrl(formatUrl(attachmentUrl, file.path))
		}
	}
}

function parseFile(file, mimeType, name, {
	boardId,
	attachmentUrl,
	toAbsoluteUrl
}) {
	const [_unused, ext] = splitFilename(file.path)
	return {
		type: 'file',
		file: {
			type: mimeType,
			name,
			ext,
			size: file.size, // in bytes
			url: toAbsoluteUrl(formatUrl(attachmentUrl, file.path))
		}
	}
}

function formatUrl(urlTemplate, url) {
	if (urlTemplate) {
		return urlTemplate.replace(/{url}/, url)
	}
	return url
}

// `lynxchan` doesn't provide `width` and `height`
// neither for the thumbnail (which is a bug).
// http://lynxhub.com/lynxchan/res/722.html#q984
function getThumbnailSize(width, height, maxSize) {
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

const PNG_REG_EXP = /-imagepng$/
const GIF_REG_EXP = /-imagegif$/
const JPG_REG_EXP = /-imagejpeg$/

function getThumbnailExt(file, type, chan) {
	// Assume that all videos have ".jpg" thumbnails (makes sense).
	if (type === 'video') {
		return '.jpg'
	}
	// `kohlchan.net` always has ".png" extension for thumbnails.
	if (chan === 'kohlchan') {
		if (PNG_REG_EXP.test(file.thumb)) {
			return '.png'
		}
		if (GIF_REG_EXP.test(file.thumb)) {
			return '.png'
		}
		if (JPG_REG_EXP.test(file.thumb)) {
			return '.jpg'
		}
	}
	// Just a guess.
	return '.jpg'
}

export function getPictureTypeFromUrl(url) {
	if (PNG_REG_EXP.test(url)) {
		return 'image/png'
	}
	if (GIF_REG_EXP.test(url)) {
		return 'image/gif'
	}
	if (JPG_REG_EXP.test(url)) {
		return 'image/jpeg'
	}
	// Just a guess.
	return 'image/jpeg'
}

function toAbsoluteUrl(url, { useRelativeUrls, chanUrl }) {
	if (url[0] === '/' && url[1] !== '/') {
		if (!useRelativeUrls) {
			return chanUrl + url
		}
	}
	return url
}

// `lynxchan` doesn't provide the original image URL
// in `/catalog.json` API response (which is a bug).
// http://lynxhub.com/lynxchan/res/722.html#q984
// This function returns the probable original image URL.
const THUMBNAIL_URL_REGEXP = /\/t_[0-9a-f]+-image([a-z]+)$/
export function guessFileUrlFromThumbnailUrl(thumbnailUrl, chan) {
	const match = thumbnailUrl.match(THUMBNAIL_URL_REGEXP)
	if (match) {
		return thumbnailUrl.replace('/t_', '/') + '.' + getExtension(`image/${match[1]}`)
	}
	// Images from `kohlchan.net` before moving to `lynxchan` in May 2019
	// have incorrect URLs: they don't have the extension part.
	// For example:
	// Exists: https://kohlchan.net/.media/82b9c3a866f6233f1c0253d3eb819ea5-imagepng
	// Not exists: https://kohlchan.net/.media/82b9c3a866f6233f1c0253d3eb819ea5-imagepng.png
	//
	// Could also be a video file URL: ignores such cases.
	//
	return thumbnailUrl
}