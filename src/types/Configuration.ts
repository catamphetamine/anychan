import type { Content } from 'social-components'

import type { Theme, Background, UserSettingsJson, DataSource } from './index.ts'

export interface Configuration {
	path?: string;
	dataSource?: string | DataSource;
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
	dataPollingRate?: DataPollingRate;
	channelsCacheTimeout?: number;
	themes?: Theme[];
	defaultTheme?: string;
	backgroundsDarkMode?: Background[];
	defaultBackgroundDarkMode?: string;
	backgroundsLightMode?: Background[];
	defaultBackgroundLightMode?: string;
	defaultSettings?: UserSettingsJson;
	defaultCensoredWords: Record<string, string[]>
}

export type DataPollingRate = 'normal' | 'slow';