import getAbsoluteUrl from '../../utility/dataSource/getAbsoluteUrl.js'

export default function convertAttachmentUrlsToAbsolute(attachment, { dataSource }) {
	const toAbsoluteUrl = (url) => getAbsoluteUrl(url, { dataSource })

	switch (attachment.type) {
		case 'picture':
			convertPictureUrlsToAbsolute(attachment.picture, { toAbsoluteUrl })
			break
		case 'video':
			convertVideoUrlsToAbsolute(attachment.video, { toAbsoluteUrl })
			break
		case 'audio':
			convertAudioUrlsToAbsolute(attachment.audio, { toAbsoluteUrl })
			break
		case 'file':
			convertFileUrlsToAbsolute(attachment.file, { toAbsoluteUrl })
			break
		case 'social':
			// Ignore. Those're supposed to already have absolute URLs.
			break
		default:
			throw new Error(`Unsupported attachment type: ${attachment.type}`)
	}
}

function convertPictureUrlsToAbsolute(picture, { toAbsoluteUrl }) {
	picture.url = toAbsoluteUrl(picture.url)
	if (picture.sizes) {
		for (const size of picture.sizes) {
			size.url = toAbsoluteUrl(size.url)
		}
	}
}

function convertVideoUrlsToAbsolute(video, { toAbsoluteUrl }) {
	if (video.url) {
		video.url = toAbsoluteUrl(video.url)
	}
	if (video.picture) {
		convertPictureUrlsToAbsolute(video.picture, { toAbsoluteUrl })
	}
}

function convertAudioUrlsToAbsolute(audio, { toAbsoluteUrl }) {
	if (audio.url) {
		audio.url = toAbsoluteUrl(audio.url)
	}
	if (audio.picture) {
		convertPictureUrlsToAbsolute(audio.picture, { toAbsoluteUrl })
	}
}

function convertFileUrlsToAbsolute(file, { toAbsoluteUrl }) {
	if (file.url) {
		file.url = toAbsoluteUrl(file.url)
	}
	if (file.picture) {
		convertPictureUrlsToAbsolute(file.picture, { toAbsoluteUrl })
	}
}