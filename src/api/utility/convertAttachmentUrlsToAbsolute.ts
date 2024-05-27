import type { Attachment, Picture, Video, Audio, File } from 'social-components'
import type { DataSource } from '@/types'

import getAbsoluteUrl from '../../utility/dataSource/getAbsoluteUrl.js'

export default function convertAttachmentUrlsToAbsolute(attachment: Attachment, { dataSource }: { dataSource: DataSource }) {
	const toAbsoluteUrl = (url: string) => getAbsoluteUrl(url, { dataSource })

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
			throw new Error(`Unsupported attachment type: ${JSON.stringify(attachment)}`)
	}
}

function convertPictureUrlsToAbsolute(picture: Picture, { toAbsoluteUrl }: { toAbsoluteUrl: (url: string) => string }) {
	picture.url = toAbsoluteUrl(picture.url)
	if (picture.sizes) {
		for (const size of picture.sizes) {
			size.url = toAbsoluteUrl(size.url)
		}
	}
}

function convertVideoUrlsToAbsolute(video: Video, { toAbsoluteUrl }: { toAbsoluteUrl: (url: string) => string }) {
	if (video.url) {
		video.url = toAbsoluteUrl(video.url)
	}
	if (video.picture) {
		convertPictureUrlsToAbsolute(video.picture, { toAbsoluteUrl })
	}
}

function convertAudioUrlsToAbsolute(audio: Audio, { toAbsoluteUrl }: { toAbsoluteUrl: (url: string) => string }) {
	if (audio.url) {
		audio.url = toAbsoluteUrl(audio.url)
	}
	if (audio.picture) {
		convertPictureUrlsToAbsolute(audio.picture, { toAbsoluteUrl })
	}
}

function convertFileUrlsToAbsolute(file: File, { toAbsoluteUrl }: { toAbsoluteUrl: (url: string) => string }) {
	if (file.url) {
		file.url = toAbsoluteUrl(file.url)
	}
	if (file.picture) {
		convertPictureUrlsToAbsolute(file.picture, { toAbsoluteUrl })
	}
}