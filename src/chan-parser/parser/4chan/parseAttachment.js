import getMimeType from '../../utility/getMimeType'
import splitFilename from '../../utility/splitFilename'

export default function parseAttachment(file, options) {
	const { chan } = options
	if (chan === '8ch') {
		if (file.fpath) {
			options = {
				...options,
				// `8ch.net` has `fpath: 0/1` parameter for attachments:
				// "fpath" attachments are hosted at the global board-agnostic
				// "fpath" URLs (not having `boardId` as part of their URL)
				// and all other attachments are hosted at board-specific URLs.
				attachmentUrl: options.attachmentUrlFpath,
				attachmentThumbnailUrl: options.attachmentThumbnailUrlFpath
			}
		}
	}
	let name
	// Just in case there's some new file type without a `filename`.
	if (file.filename) {
		name = splitFilename(file.filename)[0]
	}
	const mimeType = getMimeType(file.ext)
	if (mimeType && mimeType.indexOf('image/') === 0) {
		return parsePicture(file, mimeType, name, options)
	}
	if (mimeType && mimeType.indexOf('video/') === 0) {
		return parseVideo(file, mimeType, name, options)
	}
	// `kohlchan.net` supports attaching audio files.
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
	const thumbnailType = getMimeType(thumbnailExt)
	const sizes = [{
		type: thumbnailType,
		width: file.tn_w,
		height: file.tn_h,
		url: formatUrl(attachmentThumbnailUrl, boardId, file.tim, thumbnailExt, file.filename)
	}]
	// `4chan.org` generates smaller copies of images (limited to 1024x1024)
	// for images having both width and height greater than 1024px.
	// These images are in the same location as usual but the filename ends with "m".
	// `m_img` parameter indicates that this smaller image is available.
	// https://github.com/4chan/4chan-API/issues/63
	if (chan === '4chan' && file.m_img) {
		const aspectRatio = file.w / file.h
		sizes.push({
			type: thumbnailType,
			width: aspectRatio >= 1 ? 1024 : Math.round(1024 * aspectRatio),
			height: aspectRatio >= 1 ? Math.round(1024 / aspectRatio) : 1024,
			url: formatUrl(attachmentUrl, boardId, file.tim + 'm', thumbnailExt, file.filename)
		})
	}
	const attachment = {
		type: 'picture',
		picture: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: name,
			width: file.w,
			height: file.h,
			size: file.fsize, // in bytes
			url: formatUrl(attachmentUrl, boardId, file.tim, file.ext, file.filename),
			sizes
		}
	}
	// `8ch.net` and `4chan.org` have `spoiler: 0/1` on attachments.
	if (file.spoiler) {
		attachment.spoiler = true
	}
	return attachment
}

function parseVideo(file, mimeType, name, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl
}) {
	const thumbnailExt = getThumbnailExt(file, 'video', chan)
	const attachment = {
		type: 'video',
		video: {
			type: mimeType,
			// Most of the times users would prefer not disclosing the actual file name.
			// title: name,
			width: file.w,
			height: file.h,
			size: file.fsize, // in bytes
			url: formatUrl(attachmentUrl, boardId, file.tim, file.ext, file.filename),
			picture: {
				type: getMimeType(thumbnailExt),
				width: file.tn_w,
				height: file.tn_h,
				url: formatUrl(attachmentThumbnailUrl, boardId, file.tim, thumbnailExt, file.filename)
			}
		}
	}
	// `8ch.net` and `4chan.org` have `spoiler: 0/1` on attachments.
	if (file.spoiler) {
		attachment.spoiler = true
	}
	return attachment
}

function parseAudio(file, mimeType, name, {
	boardId,
	fileAttachmentUrl,
	attachmentUrl
}) {
	return {
		type: 'audio',
		audio: {
			type: mimeType,
			title: name,
			url: formatUrl(fileAttachmentUrl || attachmentUrl, boardId, file.tim, file.ext, file.filename)
		}
	}
}

function parseFile(file, mimeType, name, {
	boardId,
	attachmentUrl,
	fileAttachmentUrl
}) {
	return {
		type: 'file',
		file: {
			type: mimeType,
			name,
			ext: file.ext,
			size: file.fsize, // in bytes
			width: file.w, // 4chan.org `/f/` board attachments (Flash files) have `width` and `height`.
			height: file.h, // 4chan.org `/f/` board attachments (Flash files) have `width` and `height`.
			url: formatUrl(fileAttachmentUrl || attachmentUrl, boardId, file.tim, file.ext, file.filename)
		}
	}
}

function getThumbnailExt(file, type, chan) {
	// Assume that all videos have ".jpg" thumbnails (makes sense).
	if (type === 'video') {
		return '.jpg'
	}
	// `4chan.org` always has ".jpg" extension for thumbnails.
	if (chan === '4chan') {
		return '.jpg'
	}
	// `8ch.net` has same file extension for thumbnails (even for GIFs).
	if (chan === '8ch') {
		return file.ext
	}
	// `lainchan.org` always has ".png" extension for thumbnails.
	if (chan === 'lainchan' || chan === 'arisuchan') {
		return '.png'
	}
	return file.ext
}

function formatUrl(url, boardId, name, ext, originalName) {
	return url
		.replace(/{boardId}/g, boardId)
		.replace(/{name}/g, name)
		.replace(/{ext}/g, ext)
		.replace(/{originalName}/g, originalName)
}