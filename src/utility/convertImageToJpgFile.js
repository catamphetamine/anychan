/**
 * Converts an `Image` instance to a JPG file.
 * Can be used when a user posts a screenshot from the clipboard.
 * @param {Image} — `Image` instance.
 * @param {string} [options.filename]
 * @param {number} [options.quality]
 * @return {Promise<File>} JPG file
 */
export default function convertImageToJpgFile(image, {
	filename = 'image.jpg',
	// Quality is set to 95% by default so that users don't whine
	// about their screenshots getting screwed by JPEG algorithm.
	quality = 0.95
} = {}) {
	return new Promise((resolve) => {
		const canvas = document.createElement('canvas')
		canvas.width = image.width
		canvas.height = image.height
		canvas.getContext('2d').drawImage(image, 0, 0)
		canvas.toBlob((blob) => {
			resolve(new File([blob], filename, { type: 'image/jpeg' }))
		})
	})
}