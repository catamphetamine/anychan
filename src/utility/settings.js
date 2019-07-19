import IGNORED_WORDS_RU from 'webapp-frontend/src/messages/offensive.ru.json'
import IGNORED_WORDS_EN from 'webapp-frontend/src/messages/offensive.en.json'

import compileWordPatterns from 'webapp-frontend/src/utility/post/compileWordPatterns'
import { applyDarkMode, applyFontSize } from 'webapp-frontend/src/utility/style'

import { getLanguageNames } from '../messages'
import { getChan } from '../chan'
import { THEMES, applyTheme } from './themes'
import UserSettings from './UserSettings'

class Settings {
	constructor(storage, {
		languages,
		getDefaultLanguage,
		getContentLanguage,
		themes
	}) {
		this.storage = storage
		this.languages = languages
		this._getDefaultLanguage = getDefaultLanguage
		this.getContentLanguage = getContentLanguage
	}

	async apply() {
		const settings = this.get()
		await applyTheme(settings.theme)
		applyDarkMode(settings.darkMode)
		applyFontSize(settings.fontSize)
	}

	get() {
		const settings = {
			...this.getDefaultSettings(),
			...this.getCustomSettings()
		}
		// Compile censored word patterns.
		if (settings.censoredWords) {
			settings.censoredWords = compileWordPatterns(settings.censoredWords, this.getContentLanguage())
		}
		return settings
	}

	getDefaultSettings() {
		return {
			theme: 'default',
			fontSize: 'medium',
			locale: this.getDefaultLanguage(),
			censoredWords: getCensoredWordsByLanguage(this.getContentLanguage())
		}
	}

	isSupportedLanguage(language) {
		return this.languages.includes(language)
	}

	getDefaultLanguage() {
		if (typeof window !== 'undefined') {
			if (this.isSupportedLanguage(navigator.language)) {
				return navigator.language
			}
		}
		if (this._getDefaultLanguage) {
			const language = this._getDefaultLanguage()
			if (language) {
				return language
			}
		}
		return this.languages[0]
	}

	getCustomSettings() {
		return this.storage.get()
	}
}

export function getCensoredWordsByLanguage(language) {
	switch (language) {
		case 'en':
			return IGNORED_WORDS_EN
		case 'ru':
			return IGNORED_WORDS_RU
	}
}

const languages = Object.keys(getLanguageNames())

const settings = new Settings(UserSettings, {
	languages,
	themes: THEMES,
	getDefaultLanguage() {
		const language = getChan().language
		if (languages.includes(language)) {
			return language
		}
	},
	getContentLanguage() {
		return getChan().language
	},
	getCensoredWordsByLanguage
})

export default settings