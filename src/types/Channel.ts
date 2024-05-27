import type { Picture } from 'social-components'

export type ChannelId = string;

export interface ChannelFromDataSource {
	id: ChannelId;
	title: string;
	category?: string;
	description?: string;
	notSafeForWork?: boolean;
	commentsPerHour?: number;
	commentContentMinLength?: number;
	mainCommentContentMaxLength?: number;
	mainCommentContentMinLength?: number;
	threadTitleRequired?: boolean;
	mainCommentContentRequired?: boolean;
	mainCommentAttachmentRequired?: boolean;
	threadAttachmentsMaxCount?: number;
	videoAttachmentMaxSize?: number;
	videoAttachmentMaxDuration?: number;
	createThreadMinInterval?: number;
	createCommentMinInterval?: number;
	createCommentWithAttachmentMinInterval?: number;
	bumpLimit?: number;
	commentContentMaxLength?: number;
	attachmentsMaxTotalSize?: number;
	attachmentMaxSize?: number;
	attachmentsMaxCount?: number;
	features?: {
		sage?: boolean;
		authorName?: boolean;
		authorEmail?: boolean;
		threadTitle?: boolean;
		commentTitle?: boolean;
		attachments?: boolean;
		threadTags?: boolean;
		votes?: boolean;
	};
	badges?: ChannelBadge[];
}

export interface ChannelBadge {
	id: string;
	title: string;
}

export interface Channel extends ChannelFromDataSource {
	// On `2ch.hk` some "clutter" channels are automatically hidden from the list of channels.
	// The rationale is that it returns a lot of inactive "user channels" in the list of channels.
	hidden?: boolean;

	// Imageboard channels don't have a picture (icon).
	picture?: Picture;

	// Imageboard channels don't have a "cover" (banner) picture (like on twitter or facebook).
	// "Unlike a profile picture, cover photos are large banner graphic that introduces visitors to an individual or brand".
	coverPicture?: Picture;
}