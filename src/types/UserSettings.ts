// import type { CompiledWordPattern } from 'social-components/types/text/index.d.ts'

// Copy-pasted from `social-components`:
// https://github.com/catamphetamine/social-components/blob/master/types/text/index.d.ts
interface CompiledWordPattern {
	includesWordStart: boolean;
	includesWordEnd: boolean;
	regexp: RegExp;
}

export interface Background {
	id: string;
	name: string;
	gradientColor1?: string;
	gradientColor2?: string;
	gradientAngle?: number;
	gradientBlendMode?: string;
	gradientZIndex?: number;
	patternOpacity?: number;
	patternBlendMode?: string;
	patternZIndex?: number;
	patternUrl?: string;
	patternSize?: string;
	patternFilter?: string;
	backgroundColor?: string;
	backdropZIndex?: number;
	backdropColor?: string;
}

export interface Theme {
	id: string;
	name: string;
	url?: string;
	css?: string;
}

export interface UserSettingsJson {
	fontSize?: "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";
	darkMode?: boolean;
	autoDarkMode?: boolean;
	autoSuggestFavoriteChannels?: boolean;
	backgroundLightMode?: Background['id'];
	backgroundDarkMode?: Background['id'];
	backgroundsLightMode?: Background[];
	backgroundsDarkMode?: Background[];
	leftHanded?: boolean;
	grammarCorrection?: boolean;
	censorWords?: boolean;
	censoredWordsPatterns?: string[];
	// This property gets added to the settings JSON object at runtime.
	// The rationale is that such pre-compiled "censored word patterns" are faster
	// because it doesn't have to re-compile them every time.
	censoredWords?: CompiledWordPattern[];
	channelLayout?: "threadsList" | "threadsListWithLatestComments" | "threadsTiles";
	channelSorting?: "default" | "popular";
	theme?: Theme['id'];
	themes?: Theme[];
	css?: string;
	locale?: string;
	proxyUrl?: string;
	channelsView?: "list" | "by-category";
	version?: number;
}

export interface UserSettings {
	constructor(storage: any, options?: { prefix?: string }): UserSettings;
	migrate(): void;
	requiresMigration(): boolean;
	get(name?: string): any;
	reset(name?: string): void;
	set(name: string, value: any): void;
	set(value: UserSettingsJson): void;
	replace(settings: UserSettingsJson): void;
	matchKey(key: string): boolean;
	onExternalChange(handler: () => void): void;
}