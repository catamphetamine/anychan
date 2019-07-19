import loadStylesheet from 'webapp-frontend/src/utility/loadStylesheet'

import UserSettings from './UserSettings'

import DefaultThemeUrl from '../styles/theme/default.css'
import NeonGenesisEvangelionThemeUrl from '../styles/theme/neon-genesis-evangelion.css'

export const THEMES = [
	{
		name: 'default',
		url: DefaultThemeUrl
	},
	{
		name: 'neon-genesis-evangelion',
		url: NeonGenesisEvangelionThemeUrl
	}
]

export function getThemes() {
	return THEMES.concat(UserSettings.get('themes', []))
}

export function getTheme(name) {
	return getThemes().find(_ => _.name === name)
}

export function isBuiltInTheme(name) {
	return THEMES.findIndex(_ => _.name === name) >= 0
}

export function addTheme(theme) {
	const themes = UserSettings.get('themes', [])
	const index = themes.findIndex(_ => _.name === theme.name)
	if (index >= 0) {
		themes[index] = theme
	} else {
		themes.push(theme)
	}
	UserSettings.set('themes', themes)
}

export function removeTheme(name) {
	const themes = UserSettings.get('themes', [])
	const index = themes.findIndex(_ => _.name === name)
	if (index >= 0) {
		themes.splice(index, 1)
		UserSettings.set('themes', themes)
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
	const previousThemeName = previousThemeStyle && previousThemeStyle.dataset.theme
	if (previousThemeName === theme.name) {
		return
	}
	function finishSwitchingTheme(style) {
		style.setAttribute('data-theme', theme.name)
		for (const { name } of themes) {
			document.body.classList.remove(`theme--${name}`)
		}
		document.body.classList.add(`theme--${theme.name}`)
		if (previousThemeStyle) {
			document.head.removeChild(previousThemeStyle)
		}
	}
	if (theme.url) {
		const stylesheet = await loadStylesheet(theme.url)
		finishSwitchingTheme(stylesheet)
	} else {
		const style = document.createElement('style')
		style.appendChild(document.createTextNode(theme.code))
		document.head.appendChild(style)
		finishSwitchingTheme(style)
	}
}