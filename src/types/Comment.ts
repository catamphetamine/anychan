import type { InlineContent, Attachment } from 'social-components'
import type { ChannelFromDataSource, Thread, Content, ContentBlock } from './index.js';

export type CommentId = number;

export interface CommentFromDataSource {
  // Comment ID.
	id: CommentId;

  // Comment title ("subject").
	title?: string;

  // The date on which the comment was created.
	createdAt: Date;

  // "Last Modified Date" of the comment.
  //
  // I guess it includes all possible comment "modification"
  // actions like editing comment text, deleting attachments, etc.
  // Is present on "modified" comments in "get thread comments"
  // API response of `lynxchan` engine.
  //
	updatedAt?: Date;

	// Tells if the comment author is the thread author.
	//
  // This feature is used on `2ch.hk` imageboard:
  // 2ch.hk` provides means for "original posters" to identify themselves
  // when replying in their own threads with a previously set "OP" cookie.
  //
	authorIsThreadAuthor?: boolean;

  // Some imageboards identify their users by a hash of their IP address subnet
  // on some of their boards (for example, all imageboards do that on `/pol/` boards).
  // On `8ch` and `lynxchan` it's a three-byte hex string (like "d1e8f1"),
  // on `4chan` it's a 8-character case-sensitive alphanumeric string (like "Bg9BS7Xl").
  //
  // Even when a thread uses `authorIds` for its comments, not all of them
  // might have it. For example, on `4chan`, users with "capcodes" (moderators, etc)
  // don't have an `authorId`.
  //
	authorId?: string;

  // If `authorId` is present then it's converted into a HEX color.
  // Example: "#c05a7f".
	authorIdColor?: string;

  // Comment author name.
	authorName?: string;

  // If this flag is `true` then it means that `authorName` is an equivalent of an `authorId`.
  // For example, `2ch.hk` autogenerates `authorName` based on IP address subnet hash on `/po` board.
	authorNameIsId?: boolean;

  // Comment author's email address.
	authorEmail?: string;

  // Comment author's "tripcode".
  // https://encyclopediadramatica.rs/Tripcode
	authorTripCode?: string;

  // A two-letter ISO country code (or "ZZ" for "Anonymized").
  // Imageboards usually show poster flags on `/int/` boards.
	authorCountry?: string;

	//
  // Some imageboards allow comment author icons on some boards.
  //
  // For example, `kohlchan.net` shows user icons on `/int/` board.
  // Author icon examples in this case: "UA", "RU-MOW", "TEXAS", "PROXYFAG", etc.
  // `authorIconUrl` is `/.static/flags/${authorIconId}.png`.
  // `authorIconName` examples in this case: "Ukraine", "Moscow", "Texas", "Proxy", etc.
  //
  // Also, `2ch.hk` allows icons for posts on various boards like `/po/`.
  // Author icon examples in this case: "nya", "liber", "comm", "libertar", etc.
  // `authorIconUrl` is `/icons/logos/${authorIconId}.png`.
  // `authorIconName` examples in this case: "Nya", "Либерализм", "Коммунизм", "Либертарианство", etc.
  //
	authorIconUrl?: string;
	authorIconName?: string;

  // If the comment was posted by a "priviliged" user
  // then it's gonna be the role of the comment author.
  // Examples: "administrator", "moderator".
	authorRole?: string;

  // `8ch.net (8kun.top)` and `lynxchan` have "global adiministrators"
  // and "board administrators", and "global moderators"
  // and "board moderators", so `authorRoleScope` is gonna be
  // "board" for a "board administrator" or "board moderator".
	authorRoleScope?: string;

  // If `true` then it means that the author was banned for the message.
	authorBan?: {
	  // An optional `String` with the ban reason.
		reason?: string
	};

  // If `true` then it means that the author has been verified
  // to be the one who they're claiming to be.
  // For example, `{ authorName: "Gabe Newell", authorVerified: true }`
  // would mean that that's real Gabe Newell posting in an "Ask Me Anything" thread.
  // It's the same as the "verified" checkmark on celebrities pages on social media like Twitter.
	authorVerified?: boolean;

  // If this comment was posted with a "sage".
  // https://knowyourmeme.com/memes/sage
	//
	// "Sage" is a legacy feature that is used in legacy imageboard engines.
	//
	sage?: boolean;

  // Upvotes count for this comment.
  // If comment rating is enabled, `upvotes` could or could not be present.
	upvotes?: number;

  // Downvotes count for this comment.
  // If comment rating is enabled, `upvotes` could or could not be present.
	downvotes?: number;

  // Comment content.
  //
  // If `parseContent: false` option was passed then `content` will be
  // whatever was returned from the server (usually an HTML string or `undefined`).
  // Otherwise, the `content` is gonna be a `Content` structure (or `undefined`).
	// https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md
	//
  // Example: `[['Comment text']]`.
  //
	content?: Content;

  // If the `content` is too long then a preview is generated.
	contentPreview?: Content;

	// Attachments.
	attachments?: Attachment[];

  // The IDs of the comments to which this `comment` replies.
  // If some of the replies have been deleted, their IDs will not be present in this list.
	inReplyToIds?: CommentId[];

  // If this `comment` replies to some other comments that have been deleted,
  // then this is gonna be the list of IDs of such deleted comments.
	inReplyToIdsRemoved?: CommentId[];

  // The IDs of the comments that are replies to this `comment`.
	replyIds?: CommentId[];

	// `parseContent()` function is used to parse `comment.content` string
	// from data-source-specific comment syntax into a `Content` structure.
	// https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md
	parseContent?: (options?: { getCommentById?: GetCommentFromDataSourceById }) => void;

	// Creates a `contentPreview` property on this `Comment`.
	// `contentPreview` is a shorter version of a `content` property.
	createContentPreview?: (options?: { maxLength?: number }) => void;

	// Returns `true` if `comment.content` has been parsed.
	hasContentBeenParsed?: () => boolean;

	// An application should call this function whenever the `content` of the `Comment` changes.
	//
	// When could the `content` of a comment change? For example, when some resources
	// like YouTube video links from the `content` get "loaded" and auto-"embedded".
	//
	// This function will update any related stuff such as the autogenerated quotes in replies to this comment.
	//
	// This function returns an array of `id`s of the comments whose content got affected (and was updated).
	//
	onContentChange?: (options?: { getCommentById: GetCommentFromDataSourceById }) => Array<CommentFromDataSource['id']>;
}

export interface Comment extends CommentFromDataSource, RootCommentPropertiesOfThread {
	// // The `content` of `CommentFromDataSource` will be forcefully converted to a list of `ContentBlock`s.
	// //
	// // The rationale is that it's easier to operate on (i.e. post-process) a single pre-defined type of structure
	// // rather than support different edge cases like `content` being just a `string`.
	// //
	// // As per the document, `Content` can be either a `string` or an array of `ContentBlock`s.
	// // https://gitlab.com/catamphetamine/social-components/-/blob/master/docs/Content.md
	// // Therefore, if the application receives a `string` from a data source, it converts it to a `[[string]]` structure.
	// //
	// content?: ContentBlock[],

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

	// The "original" comment is marked as `isMainComment: true`.
	isMainComment?: boolean;

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
	// contentPreview?: ContentBlock[];
	contentPreview?: Content;

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

type GetCommentFromDataSourceById = (id: CommentId) => CommentFromDataSource | undefined;
export type GetCommentById = (id: CommentId) => Comment | undefined;
