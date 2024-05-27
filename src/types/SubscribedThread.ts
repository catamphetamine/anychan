import type { ChannelId, ThreadId } from './index.js'

export interface SubscribedThread {
	id: ThreadId;
	title: string;
	channel: {
		id: ChannelId;
		title: undefined; // string;
	};
	addedAt: Date;
	updatedAt?: Date;
	thumbnail?: {
		type: string,
		url: string,
		width: number,
		height: number,
		spoiler?: boolean
	};
	own?: boolean;
	expired?: boolean;
	expiredAt?: Date;
	archived?: boolean;
	archivedAt?: Date;
	locked?: boolean;
	lockedAt?: Date;
	trimming?: boolean;
}
