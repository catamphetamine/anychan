import { getContentTypeByFileName } from '../parseAttachment'

function formatUrl(url, boardId, name, ext, originalName) {
	return url
		.replace(/{boardId}/g, boardId)
		.replace(/{name}/g, name)
		.replace(/{ext}/g, ext)
		.replace(/{originalName}/g, originalName)
}

export default function parseAttachment(file, {
	chan,
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	// `8ch.net` has `fpath: 0/1` parameter.
	attachmentUrlFpath,
	attachmentThumbnailUrlFpath,
	fileAttachmentUrl
}) {
	if (chan === '8ch') {
		if (file.fpath) {
			attachmentUrl = attachmentUrlFpath
			attachmentThumbnailUrl = attachmentThumbnailUrlFpath
		}
	}
	const contentType = getContentTypeByFileName(file.ext)
	if (contentType && contentType.indexOf('image/') === 0) {
		const picture = {
			type: 'picture',
			size: file.fsize, // in bytes
			picture: {
				type: contentType,
				sizes: [{
					width: file.tn_w,
					height: file.tn_h,
					url: formatUrl(attachmentThumbnailUrl, boardId, file.tim, getThumbnailExt(file, 'picture', chan), file.filename)
				}, {
					width: file.w,
					height: file.h,
					url: formatUrl(attachmentUrl, boardId, file.tim, file.ext, file.filename)
				}]
			}
		}
		// `8ch.net` and `4chan.org` have `spoiler: 0/1` on attachments.
		if (file.spoiler) {
			picture.spoiler = true
		}
		return picture
	}
	if (contentType && contentType.indexOf('video/') === 0) {
		const thumbnailExt = getThumbnailExt(file, 'video', chan)
		const video = {
			type: 'video',
			size: file.fsize, // in bytes
			video: {
				type: contentType,
				width: file.w,
				height: file.h,
				source: {
					provider: 'file',
					sizes: [{
						width: file.w,
						height: file.h,
						url: formatUrl(attachmentUrl, boardId, file.tim, file.ext, file.filename)
					}]
				},
				picture: {
					type: getContentTypeByFileName(thumbnailExt),
					sizes: [{
						width: file.tn_w,
						height: file.tn_h,
						url: formatUrl(attachmentThumbnailUrl, boardId, file.tim, thumbnailExt, file.filename)
					}]
				}
			}
		}
		// `8ch.net` and `4chan.org` have `spoiler: 0/1` on attachments.
		if (file.spoiler) {
			video.spoiler = true
		}
		return video
	}
	return {
		type: 'file',
		file: {
			contentType,
			name: file.filename,
			ext: file.ext,
			size: file.fsize, // in bytes
			width: file.w, // 4chan.org `/f/` board attachments (Flash files) have `width` and `height`.
			height: file.h, // 4chan.org `/f/` board attachments (Flash files) have `width` and `height`.
			url: formatUrl(fileAttachmentUrl || '#', boardId, file.tim, file.ext, file.filename)
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
	// `kohlchan.net` always has ".png" extension for thumbnails.
	if (chan === 'kohlchan') {
		return '.png'
	}
	return file.ext
}