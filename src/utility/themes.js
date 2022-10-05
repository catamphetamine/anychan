import loadStylesheet from 'frontend-lib/utility/loadStylesheet.js'

import getUserSettings from '../UserSettings.js'

import { getDefaultThemes } from './settings/settingsDefaults.js'

import configuration from '../configuration.js'

function getBuiltInThemes() {
	return getDefaultThemes().concat(configuration.themes || [])
}

export function getThemes({ userSettings = getUserSettings() } = {}) {
	return getBuiltInThemes().concat(userSettings.get('themes') || [])
}

export function getTheme(id) {
	return getThemes().find(_ => _.id === id)
}

export function isBuiltInTheme(id) {
	return getBuiltInThemes().findIndex(_ => _.id === id) >= 0
}

export function addTheme(theme, { userSettings = getUserSettings() } = {}) {
	const themes = userSettings.get('themes') || []
	const index = themes.findIndex(_ => _.id === theme.id)
	if (index >= 0) {
		themes[index] = theme
	} else {
		themes.push(theme)
	}
	userSettings.set('themes', themes)
}

export function removeTheme(id, { userSettings = getUserSettings() } = {}) {
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
 * @param  {(string|object)} theme
 * @param {object[]} [themes]
 */
export async function applyTheme(theme) {
	if (typeof theme === 'string') {
		theme = getTheme(theme)
	}
	const themes = getThemes()
	const previousThemeStyle = document.head.querySelector('[data-theme]')
	const previousThemeId = previousThemeStyle && previousThemeStyle.dataset.theme
	if (previousThemeId === theme.id) {
		return
	}
	function finishSwitchingTheme(style) {
		style.setAttribute('data-theme', theme.id)
		for (const { id } of themes) {
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
}