import loadStylesheet from 'webapp-frontend/src/utility/loadStylesheet'

import UserSettings from './UserSettings'

import { DEFAULT_THEMES } from './settingsDefaults'

import configuration from '../configuration'

export const BUILT_IN_THEMES = [
	...DEFAULT_THEMES,
	...(configuration.themes || [])
]

export function getThemes() {
	return BUILT_IN_THEMES.concat(UserSettings.get('themes', []))
}

export function getTheme(id) {
	return getThemes().find(_ => _.id === id)
}

export function isBuiltInTheme(id) {
	return BUILT_IN_THEMES.findIndex(_ => _.id === id) >= 0
}

export function addTheme(theme) {
	const themes = UserSettings.get('themes', [])
	const index = themes.findIndex(_ => _.id === theme.id)
	if (index >= 0) {
		themes[index] = theme
	} else {
		themes.push(theme)
	}
	UserSettings.set('themes', themes)
}

export function removeTheme(id) {
	const themes = UserSettings.get('themes', [])
	const index = themes.findIndex(_ => _.id === id)
	if (index >= 0) {
		themes.splice(index, 1)
		if (themes.length === 0) {
			UserSettings.reset('themes')
		} else {
			UserSettings.set('themes', themes)
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