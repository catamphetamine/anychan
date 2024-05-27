import type { Content } from 'social-components'

export interface Announcement {
	date: string;
	content: Content;
	read?: boolean;
}