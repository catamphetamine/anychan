// Preloads an image before displaying it.
// Returns a `Promise<void>`.
export default function preloadImage(url: string) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => resolve(image)
		// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#Image_loading_errors
		image.onerror = (event) => {
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
		image.src = url
	})
}