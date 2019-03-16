import { getContentTypeByFileName } from '../parseAttachment'

function formatUrl(url, boardId, name, ext, originalName) {
	return url
		.replace(/{boardId}/g, boardId)
		.replace(/{name}/g, name)
		.replace(/{ext}/g, ext)
		.replace(/{originalName}/g, originalName)
}

export default function parseAttachment(file, {
	boardId,
	attachmentUrl,
	attachmentThumbnailUrl,
	fileAttachmentUrl
}) {
	const contentType = getContentTypeByFileName(file.ext)
	if (contentType && contentType.indexOf('image/') === 0) {
		// Assume ".gif" thumbnails have ".jpg" extension.
		const thumbnailExtension = contentType === 'image/gif' ? '.jpg' : file.ext
		return {
			type: 'picture',
			size: file.fsize, // in bytes
			picture: {
				type: contentType,
				sizes: [{
					width: file.tn_w,
					height: file.tn_h,
					url: formatUrl(attachmentThumbnailUrl, boardId, file.tim, thumbnailExtension, file.filename)
				}, {
					width: file.w,
					height: file.h,
					url: formatUrl(attachmentUrl, boardId, file.tim, file.ext, file.filename)
				}]
			}
		}
	}
	if (contentType && contentType.indexOf('video/') === 0) {
		return {
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
					type: 'image/jpeg',
					sizes: [{
						width: file.tn_w,
						height: file.tn_h,
						url: formatUrl(attachmentThumbnailUrl, boardId, file.tim, '.jpg', file.filename)
					}]
				}
			}
		}
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
			url: formatUrl(fileAttachmentUrl, boardId, file.tim, file.ext, file.filename)
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