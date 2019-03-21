import { getContentTypeByFileName } from '../parseAttachment'

const STICKER_FILE_TYPE = 100

const ORIGIN = 'https://2ch.hk'

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
		case STICKER_FILE_TYPE:
			return 'image/png'
	}
}

export default function parseAttachment(file, { useRelativeUrls }) {
	// `2ch` runs on multiple domains in case one of them is blocked.
	// (2ch.hk, 2ch.so, 2ch.pm, 2ch.yt, 2ch.wf, 2ch.re).
	// By using relative URLs in case of running on an "official" domain
	// attachment URLs will keep working if `2ch.hk` domain is blocked.
	const origin = useRelativeUrls ? '' : ORIGIN
	let contentType = getContentTypeByFileType(file.type)
	// Fallback for incorrect attachments.
	// (there were some cases supposedly in old threads)
	if (!contentType) {
		contentType = getContentTypeByFileName(file.path)
	}
	if (contentType && contentType.indexOf('image/') === 0) {
		const picture = {
			type: 'picture',
			size: file.size * 1024, // in bytes
			picture: {
				type: contentType,
				sizes: [{
					width: file.tn_width,
					height: file.tn_height,
					url: `${origin}${file.thumbnail}`
				}, {
					width: file.width,
					height: file.height,
					url: `${origin}${file.path}`
				}]
			}
		}
		if (file.type === STICKER_FILE_TYPE) {
			picture.picture.kind = 'sticker'
			// // A link to a page with "Add this sticker to your library" button.
			// // Example: "/makaba/stickers/show/DJfQnwJM".
			// picture.picture.installStickerLink = `${origin}${file.install}`
		}
		return picture
	}
	if (contentType && contentType.indexOf('video/') === 0) {
		return {
			type: 'video',
			size: file.size * 1024, // in bytes
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
						url: `${origin}${file.path}`
					}]
				},
				picture: {
					type: getContentTypeByFileName(file.thumbnail),
					sizes: [{
						width: file.tn_width,
						height: file.tn_height,
						url: `${origin}${file.thumbnail}`
					}]
				}
			}
		}
	}
	const [name, ext] = splitFilename(file.fullname)
	return {
		type: 'file',
		file: {
			contentType,
			name,
			ext,
			size: file.size * 1024, // in bytes
			width: file.width,
			height: file.height,
			url: `${origin}${file.path}`
		}
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

function splitFilename(filename) {
	const dotIndex = filename.lastIndexOf('.')
	if (dotIndex > 0 || dotIndex < filename.length - 1) {
		return [
			filename.slice(0, dotIndex),
			filename.slice(dotIndex)
		]
	}
	return [filename, undefined]
}