import type { InlineElementPostLink, PictureAttachment, VideoAttachment } from 'social-components'
import type { Attachment as Attachment_ } from 'social-components'

export type InlineElementPostLinkWithId = InlineElementPostLink & {
	_id: number
}

export type Attachment = Attachment_ & {
	// Just so that TypeScript doesn't show an error when reading `.spoiler` property
	// of a generic `Attachment` which is not a `PictureAttachment` or a `VideoAttachment`.
	spoiler?: boolean
}

export type AttachmentSlide = PictureAttachment | VideoAttachment

export type onAttachmentClick = (postThumbnail: Attachment, { imageElement }: { imageElement: HTMLImageElement }) => void;
