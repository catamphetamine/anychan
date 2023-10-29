import convertImageToJpgFile from './convertImageToJpgFile.js'

/**
 * Converts a PNG file to a JPG file.
 * Can be used when a user posts a screenshot from the clipboard.
 * @param {File} — PNG file
 * @return {Promise<File>} JPG file
 */
export default function convertPngToJpg(file, options) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => {
			convertImageToJpgFile(image, options).then(resolve, reject)
		}
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Image_loading_errors
		image.onerror = (event) => {
			reject(error)
		}
		image.src = URL.createObjectURL(file)
	})
}