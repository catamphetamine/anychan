import loadStylesheet from 'frontend-lib/utility/loadStylesheet.js'

import { getDefaultThemes } from './settings/settingsDefaults.js'

import getConfiguration from '../configuration.js'

function getBuiltInThemes() {
	return getDefaultThemes().concat(getConfiguration().themes || [])
}

export function getThemes({ userSettings }) {
	return _getThemes({ themes: userSettings.get('themes') })
}

function _getThemes({ themes }) {
	return getBuiltInThemes().concat(themes || [])
}

export function getTheme(id, { userSettings }) {
	return _getTheme(id, { themes: userSettings.get('themes') })
}

function _getTheme(id, { themes }) {
	return _getThemes({ themes }).find(_ => _.id === id)
}

export function isBuiltInTheme(id) {
	return getBuiltInThemes().findIndex(_ => _.id === id) >= 0
}

export function addTheme(theme, { userSettings }) {
	const themes = userSettings.get('themes') || []
	const index = themes.findIndex(_ => _.id === theme.id)
	if (index >= 0) {
		themes[index] = theme
	} else {
		themes.push(theme)
	}
	userSettings.set('themes', themes)
}

export function removeTheme(id, { userSettings }) {
	const themes = userSettings.get('themes') || []
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
 * @param  {(string|object)} themeObjectOrThemeName
 * @param {object} [userSettings]
 * @param {object[]} [themes]
 * @return {boolean} `true` if the theme has been applied, `false` if there was an error.
 */
export async function applyTheme(themeObjectOrThemeName, { userSettings, themes, ...rest }) {
	// If `userSettings` parameter was passed, convert it to `settings` object
	// and call the function again.
	if (userSettings) {
		return applyTheme(themeObjectOrThemeName, {
			themes: userSettings.get('themes'),
			...rest
		})
	}

	// Get `theme` object.
	let theme
	if (typeof themeObjectOrThemeName === 'string') {
		theme = _getTheme(themeObjectOrThemeName, { themes })
		// If the theme couldn't be found by name,
		// log an error and return `false`.
		if (!theme) {
			console.error(`Theme not found: "${themeObjectOrThemeName}"`)
			return false
		}
	} else {
		theme = themeObjectOrThemeName
	}

	const allThemes = _getThemes({ themes })
	const previousThemeStyle = document.head.querySelector('[data-theme]')
	const previousThemeId = previousThemeStyle && previousThemeStyle.dataset.theme

	if (previousThemeId === theme.id) {
		return
	}

	function finishSwitchingTheme(style) {
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
		const style = document.createElement('style')
		style.appendChild(document.createTextNode(theme.css))
		document.head.appendChild(style)
		finishSwitchingTheme(style)
	}

	// Return `true`
	return true
}