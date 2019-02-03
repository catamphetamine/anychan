const JPG_FILE_NAME = /\.jpg$/
const JPEG_FILE_NAME = /\.jpg$/
const PNG_FILE_NAME = /\.png$/
const GIF_FILE_NAME = /\.gif$/
const WEBM_FILE_NAME = /\.webm$/
const MP4_FILE_NAME = /\.mp4$/

export function getContentTypeByFileName(fileName) {
	if (JPG_FILE_NAME.test(fileName) || JPEG_FILE_NAME.test(fileName)) {
		return 'image/jpeg'
	} else if (PNG_FILE_NAME.test(fileName)) {
		return 'image/png'
	} else if (GIF_FILE_NAME.test(fileName)) {
		return 'image/gif'
	} else if (WEBM_FILE_NAME.test(fileName)) {
		return 'video/webm'
	} else if (MP4_FILE_NAME.test(fileName)) {
		return 'video/mp4'
	}
}