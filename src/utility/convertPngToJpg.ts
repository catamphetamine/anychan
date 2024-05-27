import convertImageToJpgFile from './convertImageToJpgFile.js'

/**
 * Converts a PNG file to a JPG file.
 * Can be used when a user posts a screenshot from the clipboard.
 * @param {File} — PNG file
 * @return {Promise<File>} JPG file
 */
export default function convertPngToJpg(
	file: File,
	options?: Parameters<typeof convertImageToJpgFile>[1]
): ReturnType<typeof convertImageToJpgFile> {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => {
			convertImageToJpgFile(image, options).then(resolve, reject)
		}
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Image_loading_errors
		image.onerror = (event: Event) => {
			// // Log the error to `sentry.io`.
			// reportError(new Error(event))
			// @ts-expect-error
			if (event.path && event.path[0]) {
				// @ts-expect-error
				console.error(`Image not found: ${event.path[0].src}`)
			}
			const error = new Error('IMAGE_NOT_FOUND')
			// @ts-expect-error
			error.url = url
			// @ts-expect-error
			error.event = event
			reject(error)
		}
		image.src = URL.createObjectURL(file)
	})
}