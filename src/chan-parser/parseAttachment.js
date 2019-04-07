// https://www.iana.org/assignments/media-types/media-types.xhtml
const MIME_TYPES = {
	// Picture.
	'svg': 'image/svg+xml',
	'jpg': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'gif': 'image/gif',
	'png': 'image/png',
	'bmp': 'image/bmp',
	'webp': 'image/webp',
	// Video.
	'webm': 'video/webm',
	'mp4': 'video/mp4',
	'ogv': 'video/ogg',
	// Audio.
	'mp3': 'audio/mpeg',
	'ogg': 'audio/ogg',
	'flac': 'audio/flac',
	'opus': 'audio/opus',
	// Other.
	'7z': 'application/x-7z-compressed',
	'zip': 'application/zip',
	'pdf': 'application/pdf',
	'epub': 'application/epub+zip',
	'txt': 'text/plain'
}

export function getMimeTypeByFileName(fileName) {
	const dotIndex = fileName.lastIndexOf('.')
	if (dotIndex < 0 || dotIndex === fileName.length - 1) {
		return
	}
	const extension = fileName.slice(dotIndex + 1)
	return MIME_TYPES[extension]
}