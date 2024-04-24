import type { Dispatch } from 'redux'
import type { UserSettings, Background } from '../types/UserSettings.js'

import { getDefaultBackgrounds } from './settings/settingsDefaults.js'
import { applyCss } from './themes.js'

import getConfiguration from '../getConfiguration.js'

import { setBackgroundLightMode, setBackgroundDarkMode } from '../redux/app.js'

function getAdditionalBackgroundsFromConfiguration(type: 'dark' | 'light') {
	switch (type) {
		case 'dark':
			return getConfiguration().backgroundsDark
		case 'light':
			return getConfiguration().backgroundsLight
	}
}

function getAdditionalBackgroundsFromSettings(type: 'dark' | 'light', { userSettings }: { userSettings: UserSettings }) {
	switch (type) {
		case 'dark':
			return userSettings.get('backgroundsDark')
		case 'light':
			return userSettings.get('backgroundsLight')
	}
}

function getBuiltInBackgrounds(type: 'dark' | 'light') {
	return getDefaultBackgrounds(type).concat(getAdditionalBackgroundsFromConfiguration(type) || [])
}

export function getBackgrounds(type: 'dark' | 'light', { userSettings }: { userSettings: UserSettings }) {
	return _getBackgrounds(type, { backgrounds: getAdditionalBackgroundsFromSettings(type, { userSettings }) })
}

function _getBackgrounds(type: 'dark' | 'light', { backgrounds }: { backgrounds: Background[] }) {
	return getBuiltInBackgrounds(type).concat(backgrounds || [])
}

export function getBackground(id: Background['id'], type: 'dark' | 'light', { userSettings }: { userSettings: UserSettings }) {
	return _getBackground(id, type, { backgrounds: getAdditionalBackgroundsFromSettings(type, { userSettings }) })
}

function _getBackground(id: Background['id'], type: 'dark' | 'light', { backgrounds }: { backgrounds: Background[] }) {
	return _getBackgrounds(type, { backgrounds }).find((background: Background) => background.id === id)
}

export function isBuiltInBackground(type: 'dark' | 'light', id: Background['id']) {
	return getBuiltInBackgrounds(type).findIndex((background: Background) => background.id === id) >= 0
}

function applyBackground_(backgroundObjectOrBackgroundId: Background | Background['id'] | undefined, type: 'dark' | 'light', { userSettings, backgrounds, ...rest }: { userSettings?: UserSettings, backgrounds: Background[] }): Background | undefined | null {
	// If `userSettings` parameter was passed, convert it to `settings` object
	// and call the function again.
	if (userSettings) {
		return applyBackground_(backgroundObjectOrBackgroundId, type, {
			backgrounds: getAdditionalBackgroundsFromSettings(type, { userSettings }),
			...rest
		})
	}

	// Get `background` object.
	let background: Background
	if (typeof backgroundObjectOrBackgroundId === 'string') {
		background = _getBackground(backgroundObjectOrBackgroundId, type, { backgrounds })
		// If the theme couldn't be found by name,
		// log an error and return `false`.
		if (!background) {
			console.error(`Background not found: "${backgroundObjectOrBackgroundId}"`)
			return null
		}
	} else {
		background = backgroundObjectOrBackgroundId
	}

	applyCss(background && getBackgroundCss(background, type), `background-${type}-css`)

	return background
}

export function applyBackground(backgroundObjectOrBackgroundId: Background | Background['id'] | undefined, type: 'dark' | 'light', { dispatch, userSettings, backgrounds, ...rest }: { dispatch: Dispatch, userSettings?: UserSettings, backgrounds?: Background[] }) {
	const background = applyBackground_(backgroundObjectOrBackgroundId, type, {
		userSettings,
		backgrounds,
		...rest
	});
	switch (type) {
		case 'dark':
			dispatch(setBackgroundDarkMode(background && background.id))
			break
		case 'light':
			dispatch(setBackgroundLightMode(background && background.id))
			break
	}
}

const BACKGROUND_PROPERTY_NAME_TO_CSS_VARIABLE_NAME: Record<string, string> = {
	gradientColor1: '--BackgroundGradient-color--1',
	gradientColor2: '--BackgroundGradient-color--2',
	gradientBlendMode: '--BackgroundGradient-blendMode',
	gradientZIndex: '--BackgroundGradient-zIndex',
	patternOpacity: '--BackgroundPattern-opacity',
	patternBlendMode: '--BackgroundPattern-blendMode',
	patternZIndex: '--BackgroundPattern-zIndex',
	patternFilter: '--BackgroundPattern-filter',
	patternUrl: '--BackgroundPattern-url',
	patternSize: '--BackgroundPattern-size',
	backgroundColor: '--Background-backgroundColor',
	backdropZIndex: '--BackgroundBackdrop-zIndex',
	backdropColor: '--BackgroundBackdrop-backgroundColor'
}

function getBackgroundCss(background: Background, type: 'dark' | 'light'): string {
	const cssVariables: { var: string, value: string }[] = [];

	for (const propertyName of Object.keys(BACKGROUND_PROPERTY_NAME_TO_CSS_VARIABLE_NAME)) {
		const value: any = (background as Record<string, any>)[propertyName]
		if (value !== '' && value !== undefined) {
			cssVariables.push({
				var: BACKGROUND_PROPERTY_NAME_TO_CSS_VARIABLE_NAME[propertyName],
				value: value === null ? 'initial' : String(value)
			})
		}
	}

	return '.' + type + ' {\n' + cssVariables.map(_ => `${_.var}: ${_.value};`).join('\n') + '}'
}