import type { ContentBlock, InlineContent, Attachment } from 'social-components'
import type { ChannelFromDataSource, Thread } from './index.js';

export type CommentId = number;

export type GetCommentById = (id: CommentId) => Comment | undefined;

type GetCommentFromDataSourceById = (id: CommentId) => CommentFromDataSource | undefined;

export interface CommentFromDataSource {
	id: CommentId;
	title?: string;
	content?: ContentBlock[];
	createdAt?: Date;
	updatedAt?: Date;

	authorIsThreadAuthor?: boolean;
	authorId?: string;
	authorIdColor?: string;
	authorNameIsId?: boolean;
	authorName?: string;
	authorEmail?: string;
	authorTripCode?: string;
	authorCountry?: string;
	authorBadgeUrl?: string;
	authorBadgeName?: string;
	authorRole?: string;
	authorRoleScope?: string;
	authorBan?: boolean;
	authorBanReason?: string;
	authorVerified?: boolean;

	upvotes?: number;
	downvotes?: number;

	attachments?: Attachment[];

	// "Sage" is a legacy property that is used in legacy imageboard engines.
	sage?: boolean;

	// * `inReplyTo` is a list of comments it replies to.
	// * `inReplyToIds` is a list of IDs of the comments that it replies to.
	// * `inReplyToIdsRemoved` is a list of IDs of the comments that it replies to, that have been removed by moderators.
	//
	// This property was introduced when dealing with imageboards:
	// in imageboards, all comments in a thread are loaded in bulk at once,
	// i.e. not paginated, and, therefore, all data is available at once.
	// That makes it possible to populate the complete tree of replies:
	// the relationships between each an every comment.
	//
	// In a non-imageboard scenario though, it doesn't seem practical.
	// Since the imageboard have emerged in the 2000s, social communication apps
	// have moved forward and nowadays no one returns a complete list of comments
	// in a thread or a complete list of threads in a channel: everything's paginated
	// and inherently "asynchronous".
	//
	// So I personally would consider `inReplyTo` property kinda deprecated.
	// Still, they do make sense for the legacy imageboard engines, so they aren't removed.
	// But for new data sources I'd suggest skipping these entirely.
	//
	inReplyToIds?: CommentId[];
	inReplyToIdsRemoved?: CommentId[];

	// * `replies` is a list of comments that reply to this comment.
	// * `replyIds` is a list of IDs of the comments that reply to this comment.
	replyIds?: CommentId[];

	// `parseContent()` function is used to parse data source comment syntax
	// into a `social-components` `Content` structure.
	// Creates a `content` property on this `Comment`.
	parseContent?: (options?: { getCommentById?: GetCommentFromDataSourceById }) => void;

	// Creates a `contentPreview` property on this `Comment`.
	// `contentPreview` is a shorter version of a `content` property.
	createContentPreview?: (options?: { maxLength?: number }) => void;

	// Tells if `.parseContent()` function has already been called on this `Comment`.
	hasContentBeenParsed?: () => boolean;

	// The application calls this function whenever the `content` of this `Comment` changes.
	// When could the `content` of a comment change? For example, when some resources
	// like YouTube video links get loaded in its `content`.
	onContentChange?: (options?: { getCommentById: GetCommentFromDataSourceById }) => Array<CommentFromDataSource['id']>;
}

export interface Comment extends CommentFromDataSource, RootCommentPropertiesOfThread {
	// // * `inReplyTo` is a list of comments it replies to.
	// // * `inReplyToIds` is a list of IDs of the comments that it replies to.
	// // * `inReplyToIdsRemoved` is a list of IDs of the comments that it replies to, that have been removed by moderators.
	// inReplyTo?: Comment[];

	// * `replies` is a list of comments that reply to this comment.
	// * `replyIds` is a list of IDs of the comments that reply to this comment.
	//
	// * `comment.replies` property is used in `<CommentTree/>` component.
	//
	replies?: Comment[];

	// This text preview is created for the "original" comment of a thread
	// and then output in a <meta/> tag.
	textPreviewForPageDescription?: string;

	// For the list of threads in the sidebar, text previews are generated
	// to be of exact "max lines count" and exact "max line length".
	textPreviewForSidebar?: string;

	// Whether the thread uses "author ID" hashes for some or all of its commments.
	// "Author ID" hashes can be displayed for comments in order to publicly semi-identify their author
	// while preserving some degree of anynymity.
	threadHasAuthorIds?: boolean;

	// The user's vote for this comment (from history), if they have already voted previously.
	vote?: boolean;

	// Whether this comment has been marked as "hidden" by the user. Is based on the info from history.
	hidden?: boolean;

	// Whether this is the user's "own" comment. Is based on the info from history.
	own?: boolean;

	// Whether this is a comment that replies to the user's "own" comment. Is based on the info from history.
	isReplyToOwnComment?: boolean;

	// During thread auto-update, certain comments may be detected to be removed.
	removed?: boolean;

	// Comment index.
	index: number;

	// The "original" comment is marked as `isRootComment: true`.
	isRootComment?: boolean;

	// If this comment was left after the "bump limit" was reached in this thread,
	// it will be marked with `isOverBumpLimit: true`.
	isOverBumpLimit?: boolean;

	// When the comment data was received as a result of sending some API request,
	// what "viewing mode" was the application in? Was the user on a channel page?
	// Was the user on a thread page? If the user was on a channel page, was it switched
	// into "threads with latest comments" viewing mode?
	//
	// The "viewing mode" currently defines how a `Comment` gets rendered in some slight aspects.
	// For example, it doesn't show "author ID" hashes on a channel page because in those circumstances
	// those're just visual clutter without any real context.
	//
	// Most likely a better alternative would be to use React Context to find out which "viewing mode"
	// the user is currently viewing this comment in. But since `viewingMode` property already exists,
	// I didn't change it or remove it.
	//
	viewingMode: 'channel' | 'channel-latest-comments' | 'thread';

	// Country flag URL sometimes depends on the channel ID on some imageboards.
	channelIdForCountryFlag: ChannelFromDataSource['id'];

	// Leading `post-link` quotes sometimes get automatically removed to remove the visual clutter.
	// This flag tells the app if it has already done that for this `Comment`.
	_removedLeadingOriginalPostQuote?: boolean;

	// A result of calling `createContentPreview()` function on this `Comment`.
	contentPreview?: ContentBlock[];

	// * In `api/getThreads.ts` it sets `comment.channelId` for "is subscribed thread" comment header badge.
	// * It doesn't set this property in `api/getThread.ts`.
	channelId?: ChannelFromDataSource['id'];

	// When a user hasn't disabled censoring offensive words,
	// the comment title will be checked for such words along with the content.
	titleCensored?: string;
	titleCensoredContent?: InlineContent;

	/*
	parseContent: (parameters?: {
		getCommentById?: (id: Comment['id']) => Comment | undefined
	}) => void;
	*/

	// Returns comment content text for various use cases.
	getContentText: () => string;
	getContentTextSingleLine: () => string;
	getContentTextSingleLineLowerCase: () => string;
	getContentTextWithTitleSingleLineLowerCase: () => string;

	// These're private properties that shouldn't be read or written.
	contentText?: string;
	contentTextSingleLine?: string;
	contentTextSingleLineLowerCase?: string;
	contentTextWithTitleSingleLineLowerCase?: string;

	// A text-only version of a comment's content is created in order to be shown in the sidebar
	// when displaying a list of threads in a channel.
	createTextPreviewForSidebar: (parameters: {
		charactersInLine?: number,
		charactersInLastLine?: number,
		maxLines?: number
	}) => void;

	// Adds `isLynxChanCatalogAttachmentsBug: boolean` property to `Attachment` objects.
	attachments?: Array<Attachment & {
		isLynxChanCatalogAttachmentsBug?: boolean
	}>;
}

export type RootCommentPropertiesOfThread = Pick<Thread,
	// Comments count / attachments count / unique posters count — 
	// those are shown on the fist comment.
	'commentsCount' |
	'attachmentsCount' |
	'commentAttachmentsCount' |
	'uniquePostersCount' |
	// Header badges.
	'pinned' |
	'trimming' |
	'archived' |
	'locked' |
	// Bump limit indicator.
	'bumpLimitReached'>;