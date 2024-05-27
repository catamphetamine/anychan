export interface SubscribedThreadState {
	commentsCount: number;
	newCommentsCount: number;
	newRepliesCount: number;
	latestComment: {
		id: number,
		createdAt: Date
	};
	refreshedAt: Date;
	refreshErrorAt?: Date;
	refreshErrorCount?: number;
}

export type SubscribedThreadStateEncoded = Omit<SubscribedThreadState, 'latestComment' | 'refreshedAt' | 'refreshErrorAt'> & {
	latestComment: {
		id: number,
		createdAt: number
	};
	refreshedAt: number;
	refreshErrorAt?: number;
}