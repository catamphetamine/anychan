import type { UserSettings, Theme } from '../types/UserSettings.js'

import loadStylesheet from 'frontend-lib/utility/loadStylesheet.js'

import { getDefaultThemes } from './settings/settingsDefaults.js'

import getConfiguration from '../getConfiguration.js'

function getBuiltInThemes() {
	return getDefaultThemes().concat(getConfiguration().themes || [])
}

export function getThemes({ userSettings }: { userSettings: UserSettings }) {
	return _getThemes({ themes: userSettings.get('themes') })
}

function _getThemes({ themes }: { themes: Theme[] }) {
	return getBuiltInThemes().concat(themes || [])
}

export function getTheme(id: Theme['id'], { userSettings }: { userSettings: UserSettings }) {
	return _getTheme(id, { themes: userSettings.get('themes') })
}

function _getTheme(id: Theme['id'], { themes }: { themes: Theme[] }) {
	return _getThemes({ themes }).find((theme: Theme) => theme.id === id)
}

export function isBuiltInTheme(id: Theme['id']) {
	return getBuiltInThemes().findIndex((theme: Theme) => theme.id === id) >= 0
}

export function addOrUpdateTheme(theme: Theme, { userSettings }: { userSettings: UserSettings }) {
	const themes: Theme[] = userSettings.get('themes') || []
	const index = themes.findIndex(_ => _.id === theme.id)
	if (index >= 0) {
		themes[index] = theme
	} else {
		themes.push(theme)
	}
	userSettings.set('themes', themes)
}

export function removeTheme(id: Theme['id'], { userSettings }: { userSettings: UserSettings }) {
	const themes: Theme[] = userSettings.get('themes') || []
	const index = themes.findIndex(_ => _.id === id)
	if (index >= 0) {
		themes.splice(index, 1)
		if (themes.length === 0) {
			userSettings.reset('themes')
		} else {
			userSettings.set('themes', themes)
		}
	}
}

/**
 * Applies a theme to the UI.
 * Returns `true` if the theme has been applied, `false` if there was an error.
 */
export async function applyTheme(themeObjectOrThemeId: Theme | Theme['id'], { userSettings, themes, ...rest }: { userSettings?: UserSettings, themes?: Theme[] }) {
	// If `userSettings` parameter was passed, convert it to `settings` object
	// and call the function again.
	if (userSettings) {
		return applyTheme(themeObjectOrThemeId, {
			themes: userSettings.get('themes'),
			...rest
		})
	}

	// Get `theme` object.
	let theme: Theme
	if (typeof themeObjectOrThemeId === 'string') {
		theme = _getTheme(themeObjectOrThemeId, { themes })
		// If the theme couldn't be found by name,
		// log an error and return `false`.
		if (!theme) {
			console.error(`Theme not found: "${themeObjectOrThemeId}"`)
			return null
		}
	} else {
		theme = themeObjectOrThemeId
	}

	const allThemes = _getThemes({ themes })
	const previousThemeStyle: HTMLElement | undefined = document.head.querySelector('[data-theme]')
	const previousThemeId = previousThemeStyle && previousThemeStyle.dataset.theme

	if (previousThemeId === theme.id) {
		return
	}

	function finishSwitchingTheme(style: HTMLElement) {
		style.setAttribute('data-theme', theme.id)
		for (const { id } of allThemes) {
			document.body.classList.remove(`theme--${id}`)
		}
		document.body.classList.add(`theme--${theme.id}`)
		if (previousThemeStyle) {
			document.head.removeChild(previousThemeStyle)
		}
	}

	if (theme.url) {
		const stylesheet = await loadStylesheet(theme.url)
		finishSwitchingTheme(stylesheet)
	} else {
		applyCss(theme.css, 'theme-custom-css')
		finishSwitchingTheme(getCssStyleElement('theme-custom-css'))
	}

	// Return `true`
	return true
}

function getCssStyleElement(id: string): HTMLElement | undefined {
	return document.querySelector(`style[data-css-id=${id}]`)
}

export function applyCustomCss(css: string | undefined) {
	applyCss(css, 'custom-css')
}

export function applyCss(css: string | undefined, id: string) {
	let styleElement = getCssStyleElement(id)
	if (styleElement) {
		styleElement.innerText = css ? css : ''
	} else {
		styleElement = document.createElement('style')
		if (css) {
			styleElement.appendChild(document.createTextNode(css))
		}
		// style.setAttribute(key, value)
		styleElement.dataset.cssId = id
		document.head.appendChild(styleElement)
	}
}