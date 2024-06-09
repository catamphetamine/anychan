import type { Picture } from 'social-components'

export type ChannelId = string;

export interface ChannelFromDataSource {
	// Board ID.
	// Example: "b".
	id: ChannelId;

	// Board title.
	// Example: "Anime & Manga".
	title: string;

	// Board category.
	// Example: "Adult".
	category?: string;

	// Board description.
	description?: string;

	// The primary language that's used on the board.
	// Example: "en".
	//
	// For example, `kohlchan.net` imageboard is a German one
	// but it also has a separate `/ru/` board for Russian-speaking users.
	//
	language?: string;

	// Is this board "Not Safe For Work" aka "NSFW"?
	// Should this board have an "explicit content warning".
	explicitContent?: boolean;

	stats?: {
		// "Comments posted per hour" stats for this board.
		commentsPerHour?: number,

		// "Comments posted per day" stats for this board.
		commentsPerDay?: number,

		// "Unique comment posters per day" stats for this board.
		uniquePostersPerDay?: number
	};

	// Posting settings.
	post: {
		// Minimum allowed length of `content` when creating a `thread` or a `comment`.
		contentMinLength?: number,

		// Maximum allowed length of `content` when creating a `thread` or a `comment`.
		contentMaxLength?: number,

		// Whether `content` is required when creating a `thread` or a `comment`.
		contentRequired?: boolean,

		// Whether `attachments` are required when creating a `thread` or a `comment`.
		attachmentsRequired?: boolean,

		// Minimum comment length when creating a `thread`.
		mainCommentContentMinLength?: number,

		// Maximum comment length when creating a `thread`.
		mainCommentContentMaxLength?: number,

		// Whether `content` is required when creating a `thread`.
		mainCommentContentRequired?: boolean,

		// Whether `attachments` are required when creating a `thread`.
		mainCommentAttachmentsRequired?: boolean,

		// Describes comment content syntax.
		contentSyntax?: {
			// Whether one could use "TeX" scientific language when writing comment content.
			tex?: boolean,

			// Whether one could use "code" (monospace & syntax hihlighting) when writing comment content.
			code?: boolean
		},

		// Tells if `attachments` are allowed when creating a `thread` or a `comment`.
		attachments?: boolean,

		// Tells if `attachments` are required when creating a `thread`.
		threadAttachmentsRequired?: boolean,

		// Tells if attachments could be marked with "spoilers" when creating a `thread` or a `comment`.
		attachmentSpoiler?: boolean,

		// Allowed attachment types: "image", "image:animated", "video", etc.
		// Sometimes, a data source specifies allowed types of attachments
		// and sometimes they do that for allowed MIME-types of attachments.
		attachmentTypes?: AttachmentType[],

		// Allowed attachment MIME-types: "image/png", "video/mp4", etc.
		// Sometimes, a data source specifies allowed types of attachments
		// and sometimes they do that for allowed MIME-types of attachments.
		attachmentFileTypes?: AttachmentFileType[],

		// Maximum allowed attachment size.
		attachmentMaxSize?: number,

		// Maximum allowed total size of attachments.
		attachmentsMaxSize?: number,

		// Maximum allowed total count of attachments.
		attachmentsMaxCount?: number,

		// Maximum allowed video attachment size.
		videoAttachmentMaxSize?: number,

		// Maximum allowed video attachment duration (in seconds).
		videoAttachmentMaxDuration?: number,

		// Maximum count of attachments allowed in a thread.
		threadAttachmentsMaxCount?: number,

		// Minimum interval for creating a thread.
		// I guess the interval is across all users.
		threadMinInterval?: number,

		// Minimum interval for creating a comment.
		// I guess the interval is across all users.
		commentMinInterval?: number,

		// Minimum interval for creating a comment that has any attachments.
		// I guess the interval is across all users.
		commentWithAttachmentsMinInterval?: number,

		// Whether creating new threads is allowed on this board.
		thread?: boolean,

		// Whether solving a CAPTCHA is required in order to create a `thread`
		// not being logged in.
		threadCaptchaRequired?: boolean,

		// Whether solving a CAPTCHA is required in order to create a `comment`
		// not being logged in.
		captchaRequired?: boolean,

		// Tells if `authorName` is allowed when creating a `thread` or a `comment`.
		authorName?: boolean,

		// Tells if `authorEmail` is allowed when creating a `thread` or a `comment`.
		authorEmail?: boolean,

		// Tells if "sage" feature is supported.
		// "Sage" is a remnant of the early ages of imageboards:
		// when a user submits a comment with `authorEmail: "sage"`,
		// their comment doesn't "bump" the thread they're replying to.
		// That was a way to "spam" or "wipe" a thread users didn't like.
		authorEmailSage?: boolean,

		// Whether "trip codes" are allowed when creating a `thread` or a `comment`.
		// https://encyclopediadramatica.rs/Tripcode
		authorTripCode?: boolean,

		// When comment author icon can be selected when creating a `thread` or a `comment`,
		// this is gonna be a list of available icons for selection.
		//
		// Each "icon" has an `id` and a `title`.
		//
		authorIcons?: CommentAuthorIcon[],

		// Whether comment author ID hashes are recorded when creating a `thread` or a `comment`.
		authorId?: boolean,

		// Whether comment author country flag is recorded when creating a `thread` or a `comment`.
		authorCountry?: boolean,

		// Whether `title` is allowed when creating a thread.
		threadTitle?: boolean,

		// Whether `title` is required when creating a thread.
		threadTitleRequired?: boolean,

		// Whether the board allows specifying "tags" when creating a new thread.
		// The tags themselves can be selected from the list of `tags` of the `board` object:
		// `board.tags` is just an intersection of individual thread `tags`.
		threadTags?: boolean,

		// If the board allows specifying "tags" when creating a new thread,
		// this is gonna be the maximum allowed count of tags for a given thread.
		threadTagsMaxCount?: number
	};

	features?: {
		// If threads are archived on this board, the `archive` object
		// could describe the archival settings.
		archive?: {},

		// Anonymous comment author name.
		// Is usually "Anonymous" on imageboards.
		defaultAuthorName?: string,

		// Tells if `api.rateComment()` API is supported on the board.
		//
		// In case of `commentRating: "↕"`, each comment can (but not required to) have properties:
		// * `upvotes?: number`
		// * `downvotes?: number`
		//
		commentRating?: '↕',

		// "Bump limit" for threads on this board:
		// the maximum count of comments in a thread until the "bump" feature stops working for it.
		//
		// "Bump" feature is used on imageboards.
		// Threads get "bumped" whenever someone leaves a comment in them.
		// "Bumping" a thread moves it to the top of the list of threads on the board
		// therefore preventing it from being erased due to being pushed down off the list.
		//
		bumpLimit?: number,

		// When one could specify a "tag" when creating a thread on the board,
		// the `tags` list could contain the compiled list of all tags of all threads on the board.
		threadTags?: string[]
	};
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

export interface CommentAuthorIcon {
	id: string;
	title: string;
}

// Attachment types.
export type AttachmentType =
	'image' |
	'image:animated' |
	'video' |
	'audio' |
	'file'

// Attachment MIME-types.
// Examples: "image/png", "video/mp4".
export type AttachmentFileType = string