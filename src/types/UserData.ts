import type { Storage } from 'web-browser-storage';

import type {
	Channel,
	Thread,
	Comment,
	FavoriteChannel,
	SubscribedThread,
	SubscribedThreadState,
	Announcement
} from './index.js';

import type UserDataCleaner from '@/UserData/UserDataCleaner.js';

export type UserDataCollectionName = string;

export type UserDataOperation = 'addTo' | 'getFrom' | 'removeFrom' | 'setIn' | 'get' | 'set' | 'remove' | 'mergeWith';

export type UserDataCollectionType = 'channels-threads-data' | 'channels-thread-data' | 'channels-threads-comments' | 'channels-threads-comments-data' | 'channels-data' | 'channels-threads' | 'value' | 'list' | 'map';

export type UserDataOperationCustom = (parameters: Partial<Record<UserDataOperation, Function>>) => (...args: any[]) => any;

export interface UserDataCollection {
	name: UserDataCollectionName;
	shortName: string | null;
	type: UserDataCollectionType;
	methods?: Record<string, UserDataOperation | UserDataOperationCustom>;
	schema?: object;
	decode?: (data: UserDataChunkDataEncoded) => UserDataChunkData;
	encode?: (data: UserDataChunkData) => UserDataChunkDataEncoded;
	merge?: (a: UserDataChunkDataEncoded, b: UserDataChunkDataEncoded) => UserDataChunkDataEncoded;
	cache?: boolean;
	clearOnExpire?: boolean;
	match?: (a: UserDataChunkDataEncoded, b: UserDataChunkData) => boolean;
	compare?: (a: UserDataChunkDataEncoded, b: UserDataChunkDataEncoded) => -1 | 0 | 1;
	trim?: (list: UserDataChunkDataEncoded[], maxCount: number) => UserDataChunkDataEncoded[];
	maxCount?: number;
}

export type UserDataCollections = Record<UserDataCollectionName, UserDataCollection>;

export type UserDataTypeOperation = (
	parameters: {
		decode?: UserDataCollection['decode'],
		encode?: UserDataCollection['encode'],
		compare?: UserDataCollection['compare'],
		match?: UserDataCollection['match'],
		merge?: UserDataCollection['merge'],
		maxCount?: UserDataCollection['maxCount'],
		trim?: UserDataCollection['trim']
	},
	chunkData: UserDataChunkDataEncoded,
	...args: any[]
) => any;

export interface UserDataChunkMetadata {
	channelId?: string;
	threadId?: number;
}

export declare class UserData {
	constructor(storage: Storage, parameters?: {
		prefix?: string,
		// `collections` parameter is only passed in tests.
		collections?: UserDataCollections,
		log?: (...args: any[]) => unknown,
		userDataCleaner: UserDataCleaner
	});
	getCollections(): UserDataCollections;
	start(): void;
	stop(): void;
	clear(): void;
	get(): UserDataJson;
	replace(data: UserDataJson): void;
	replaceCollectionData(collection: UserDataCollection, collectionData: any): void;
	merge(data: UserDataJson): void;
	requiresMigration(): boolean;
	migrate(): void;
	matchKey(key: string): void;
	getSize(): number;
	forEachCollection(func: (collection: UserDataCollection) => void): void;
	getCollectionDataChunks(collection: UserDataCollection): {
		key: string,
		metadata: UserDataChunkMetadata,
		read: () => UserDataChunkDataEncoded,
		write: (data: UserDataChunkDataEncoded) => void,
		delete: () => void
	}[];
	getCollectionData(collection: UserDataCollection): UserDataCollectionData;
	onExternalChange(handler: (parameters: {
		collection: UserDataCollection,
		metadata: UserDataChunkMetadata,
		value: any
	}) => void): any;
	flush(): void;
	mergeKeyData: (key: string, prevValue: any, newValue: any) => any;

	// Collection methods:

	getSubscribedThread(channelId: Channel['id'], threadId: Thread['id']): SubscribedThread | undefined;
	isSubscribedThread(channelId: Channel['id'], threadId: Thread['id']): boolean;
	updateSubscribedThread(thread: SubscribedThread): void;
	addSubscribedThread(thread: SubscribedThread): void;
	removeSubscribedThread(thread: SubscribedThreadKey): void;

	getSubscribedThreads(): SubscribedThread[];
	setSubscribedThreads(threads: SubscribedThread[]): void;

	getSubscribedThreadIdsForChannel(channelId: Channel['id']): Thread['id'][];
	addSubscribedThreadIdForChannel(channelId: Channel['id'], threadId: Thread['id']): void;
	removeSubscribedThreadIdFromChannel(channelId: Channel['id'], threadId: Thread['id']): void;

	getSubscribedThreadState(channelId: Channel['id'], threadId: Thread['id']): SubscribedThreadState | undefined;
	setSubscribedThreadState(channelId: Channel['id'], threadId: Thread['id'], state: SubscribedThreadState): void;
	removeSubscribedThreadState(channelId: Channel['id'], threadId: Thread['id']): void;

	getThreadAccessedAt(channelId: Channel['id'], threadId: Thread['id']): Date | undefined;
	setThreadAccessedAt(channelId: Channel['id'], threadId: Thread['id'], accessedAt: Date): void;
	removeThreadAccessedAt(channelId: Channel['id'], threadId: Thread['id']): void;

	getThreadVotes(id: Channel['id']): Record<string, Record<string, Vote>> | undefined;
	setThreadVote(channelId: Channel['id'], threadId: Thread['id'], vote: Vote): void;
	removeThreadVote(channelId: Channel['id'], threadId: Thread['id']): void;

	isOwnThread(channelId: Channel['id'], threadId: Thread['id']): boolean;
	getOwnThreads(id: Channel['id']): Thread['id'][];
	addOwnThread(channelId: Channel['id'], threadId: Thread['id']): void;
	removeOwnThread(channelId: Channel['id'], threadId: Thread['id']): void;

	isOwnComment(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): boolean;
	getOwnComments(channelId: Channel['id'], threadId: Thread['id']): Comment['id'][];
	addOwnComment(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): void;
	removeOwnComment(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): void;

	getLatestSeenThreadId(channelId: Channel['id']): Thread['id'] | undefined;
	setLatestSeenThreadId(channelId: Channel['id'], threadId: Thread['id']): void;

	getLatestReadCommentId(channelId: Channel['id'], threadId: Thread['id']): Comment['id'] | undefined;
	setLatestReadCommentId(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): void;
	removeLatestReadCommentId(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): void;

	isThreadHidden(channelId: Channel['id'], threadId: Thread['id']): boolean;
	getHiddenThreads(channelId: Channel['id']): Thread['id'][];
	addHiddenThread(channelId: Channel['id'], threadId: Thread['id']): void;
	removeHiddenThread(channelId: Channel['id'], threadId: Thread['id']): void;

	isCommentHidden(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): boolean;
	getHiddenComments(channelId: Channel['id'], threadId: Thread['id']): Comment['id'][];
	addHiddenComment(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): void;
	removeHiddenComment(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): void;

	isIgnoredAuthor(authorId: string): boolean;
	getIgnoredAuthors(): string[];
	addIgnoredAuthor(authorId: string): void;
	removeIgnoredAuthor(authorId: string): void;

	getCommentVotes(channelId: Channel['id'], threadId: Thread['id']): Record<string, Vote> | undefined;
	setCommentVote(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id'], vote: -1 | 1): void;
	removeCommentVote(channelId: Channel['id'], threadId: Thread['id'], commentId: Comment['id']): void;

	isFavoriteChannel(favoriteChannel: FavoriteChannel): boolean;
	getFavoriteChannels(): FavoriteChannel[];
	addFavoriteChannel(favoriteChannel: FavoriteChannel): void;
	removeFavoriteChannel(favoriteChannel: FavoriteChannel): void;

	getCleanUpFinishedAt(): number | undefined;
	setCleanUpFinishedAt(finishedAt: number): void;

	getAuth(): { accessToken: string } | undefined;
	setAuth(authInfo: { accessToken: string }): void;
	removeAuth(): void;

	getAnnouncementRefreshedAt(): number | undefined;
	setAnnouncementRefreshedAt(refreshedAt: number): void;

	getVersion(): number | undefined;
	setVersion(version: number): void;

	getAnnouncement(): Announcement | undefined;
	setAnnouncement(announcement: Announcement): void;

	setThreads(channelId: Channel['id'], threadIds: Array<Thread['id']>): void;
	getThreads(channelId: Channel['id']): Array<Thread['id']>;
}

export type UserDataJsonEncoded = Record<string, UserDataCollectionDataEncoded>;

export type UserDataJson = Record<string, any>;

export type UserDataChunkData = any;
export type UserDataChunkItemData = any;

export type UserDataCollectionData = UserDataCollectionDataValue | UserDataCollectionDataSplitByChannelId | UserDataCollectionDataSplitByChannelIdAndThreadId;

export type UserDataCollectionDataValue = any;
export type UserDataCollectionDataSplitByChannelId = Record<string, any>;
export type UserDataCollectionDataSplitByChannelIdAndThreadId = Record<string, Record<string, any>>;

export type UserDataCollectionDataEncoded = any;

export type UserDataChunkDataEncoded = any;

export type Vote = -1 | 1;

export interface SubscribedThreadKey {
	id: SubscribedThread['id'];
	channel: {
		id: SubscribedThread['channel']['id'];
	}
}