import type { UserDataCleaner } from './UserDataCleaner.js'

interface UserDataCollection {
	name: string;
	shortName?: string;
	type: 'channels-threads-data' | 'channels-thread-data' | 'channels-threads-comments' | 'channels-threads-comments-data' | 'channels-data' | 'channels-threads' | 'value' | 'list';
	methods?: Record<string, 'addTo' | 'getFrom' | 'removeFrom' | 'setIn' | 'get' | 'set' | 'remove' | Function>;
	schema?: object;
	decode?: (data: any) => any;
	encode?: (data: any) => any;
	merge?: (a: any, b: any) => any;
	cache?: boolean;
	clearOnExpire?: boolean;
	isEqual?: (a: any, b: any) => boolean;
	trim?: (list: any[], maxCount: number) => any[];
	maxCount?: number;
}

interface UserDataCollectionChunkMetadata {
	channelId?: string;
	threadId?: number;
}

export declare class UserData {
	constructor(storage: any, parameters?: {
		prefix?: string,
		// `collections` parameter is only passed in tests.
		collections?: Record<string, UserDataCollection>,
		log?: (...args: any[]) => unknown,
		userDataCleaner: UserDataCleaner
	});
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
	getCollectionDataChunks(collection: UserDataCollection): { data: any, metadata: UserDataCollectionChunkMetadata }[];
	getCollectionData(collection: UserDataCollection): any;
	onExternalChange(handler: (parameters: {
		collection: UserDataCollection,
		metadata: UserDataCollectionChunkMetadata,
		value: any
	}) => void): any;
	flush(): void;
	mergeKeyData: (key: string, prevValue: any, newValue: any) => any;
}

type UserDataJson = Record<string, any>;