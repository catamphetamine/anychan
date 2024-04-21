import type { Content } from 'social-components'

import type { UserSettings } from './UserSettings.js'

export interface Configuration {
	path?: string,
	dataSource?: string,
	icon?: string,
	logo?: string,
	title?: string,
	subtitle?: string,
	description?: Content,
	headerMarkup?: string,
	headerMarkupFullWidth?: boolean,
	footerMarkup?: string,
	footerMarkupFullWidth?: boolean,
	footnotes?: Content,
	proxyUrl?: string,
	googleAnalyticsId?: string,
	youtubeApiKey?: string,
	announcementUrl?: string,
	announcementPollInterval?: number,
	sentryUrl?: string,
	showCookieNotice?: boolean,
	cookiePolicyUrl?: string,
	generatedQuoteMaxLength?: number,
	generatedQuoteMinFitFactor?: number,
	generatedQuoteMaxFitFactor?: number,
	commentLengthLimit?: number,
	commentLengthLimitForThreadPreview?: number,
	commentLengthLimitForThreadPreviewForTileLayout?: number,
	dataPollingRate?: 'slow' | 'normal',
	channelsCacheTimeout?: number,
	themes?: {
		id: string,
		name: string,
		url: string
	}[],
	defaultTheme?: string,
	defaultSettings?: UserSettings,
	defaultCensoredWords: Record<string, string[]>
}