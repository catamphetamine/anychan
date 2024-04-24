import type { Content } from 'social-components'

import type { Theme, Background, UserSettingsJson } from './UserSettings.ts'

export interface Configuration {
	path?: string;
	dataSource?: string;
	icon?: string;
	logo?: string;
	title?: string;
	subtitle?: string;
	description?: Content;
	javascript?: string;
	bodyHtml?: string;
	headerMarkupHtml?: string;
	headerMarkupContent?: Content;
	footerMarkupHtml?: string;
	footerMarkupContent?: Content;
	footnotes?: Content;
	proxyUrl?: string;
	googleAnalyticsId?: string;
	youtubeApiKey?: string;
	announcementUrl?: string;
	announcementPollInterval?: number;
	sentryUrl?: string;
	showCookieNotice?: boolean;
	cookiePolicyUrl?: string;
	generatedQuoteMaxLength?: number;
	generatedQuoteMinFitFactor?: number;
	generatedQuoteMaxFitFactor?: number;
	commentLengthLimit?: number;
	commentLengthLimitForThreadPreview?: number;
	commentLengthLimitForThreadPreviewForTileLayout?: number;
	dataPollingRate?: 'slow' | 'normal';
	channelsCacheTimeout?: number;
	themes?: Theme[];
	defaultTheme?: string;
	backgroundsDark?: Background[];
	defaultBackgroundDark?: string;
	backgroundsLight?: Background[];
	defaultBackgroundLight?: string;
	defaultSettings?: UserSettingsJson;
	defaultCensoredWords: Record<string, string[]>
}