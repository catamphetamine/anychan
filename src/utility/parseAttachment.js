function getContentTypeByFileType(type) {
	switch (type) {
		case 1:
			return 'image/jpeg'
		case 2:
			return 'image/png'
		case 4:
			return 'image/gif'
		case 6:
			return 'video/webm'
		case 10:
			return 'video/mp4'
		// Stickers.
		case 100:
			return 'image/png'
	}
}

const JPG_FILE_NAME = /\.jpg$/
const PNG_FILE_NAME = /\.png$/
const GIF_FILE_NAME = /\.gif$/

function getContentTypeByFileName(fileName) {
	if (JPG_FILE_NAME.test(fileName)) {
		return 'image/jpeg'
	}
	if (PNG_FILE_NAME.test(fileName)) {
		return 'image/png'
	}
	if (GIF_FILE_NAME.test(fileName)) {
		return 'image/gif'
	}
}

// const ERROR_PICTURE = {
// 	type: 'image/svg+xml',
// 	sizes: [{
// 		width: 512,
// 		height: 512,
// 		url: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJTVkdJRF8xXyIgeDE9IjI1NiIgeDI9IjI1NiIgeTE9IjUxMiIgeTI9Ii05LjA5NDk0N2UtMDEzIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNFNzM4MjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGODUwMzIiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgZmlsbD0idXJsKCNTVkdJRF8xXykiIHI9IjI1NiIvPjxwYXRoIGQ9Ik0yNjguNywyNTZsMTE5LjYtMTE5LjZjMy4yLTMuMiwzLjItOC4zLDAtMTEuNGMtMy4yLTMuMi04LjMtMy4yLTExLjQsMEwyNTcuMiwyNDQuNkwxMzUuMSwxMjIuNSAgYy0zLjItMy4yLTguMy0zLjItMTEuNCwwYy0zLjIsMy4yLTMuMiw4LjMsMCwxMS40TDI0NS44LDI1NkwxMjMuNywzNzguMWMtMy4yLDMuMi0zLjIsOC4zLDAsMTEuNGMxLjYsMS42LDMuNywyLjQsNS43LDIuNCAgYzIuMSwwLDQuMS0wLjgsNS43LTIuNGwxMjIuMS0xMjIuMWwxMTkuNiwxMTkuNmMxLjYsMS42LDMuNywyLjQsNS43LDIuNGMyLjEsMCw0LjEtMC44LDUuNy0yLjRjMy4yLTMuMiwzLjItOC4zLDAtMTEuNEwyNjguNywyNTZ6IiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+'
// 	}]
// }

const TRANSPARENT_PIXEL = {
	type: 'image/png',
	sizes: [{
		width: 1,
		height: 1,
		url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
	}]
}

export default function parseAttachment(file) {
	const contentType = getContentTypeByFileType(file.type)
	if (contentType && contentType.indexOf('image/') === 0) {
		return {
			type: 'picture',
			size: file.size, // in kilobytes
			picture: {
				type: contentType,
				sizes: [{
					width: file.tn_width,
					height: file.tn_height,
					url: `https://2ch.hk${file.thumbnail}`
				}, {
					width: file.width,
					height: file.height,
					url: `https://2ch.hk${file.path}`
				}]
			}
		}
	}
	if (contentType && contentType.indexOf('video/') === 0) {
		const pictureContentType = getContentTypeByFileName(file.thumbnail)
		let picture
		if (pictureContentType) {
			picture = {
				type: pictureContentType,
				sizes: [{
					width: file.tn_width,
					height: file.tn_height,
					url: `https://2ch.hk${file.thumbnail}`
				}]
			}
		} else {
			console.error(`Unknown video picture file type: ${JSON.stringify(file)}`)
			picture = TRANSPARENT_PIXEL
		}
		return {
			type: 'video',
			size: file.size, // in kilobytes
			video: {
				type: contentType,
				duration: file.duration_secs,
				width: file.width,
				height: file.height,
				source: {
					provider: 'file',
					sizes: [{
						width: file.width,
						height: file.height,
						url: `https://2ch.hk${file.path}`
					}]
				},
				picture
			}
		}
	}
	console.error(`Unknown file type: ${JSON.stringify(file)}`)
	return TRANSPARENT_PIXEL
}