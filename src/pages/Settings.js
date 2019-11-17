import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'

import LanguageSettings from 'webapp-frontend/src/components/settings/LanguageSettings'
import FontSizeSettings from 'webapp-frontend/src/components/settings/FontSizeSettings'
import DarkModeSettings from 'webapp-frontend/src/components/settings/DarkModeSettings'

import ThemeSettings from '../components/settings/ThemeSettings'
import DataSettings from '../components/settings/DataSettings'
import CensoredWordsSettings from '../components/settings/CensoredWordsSettings'
import {
	saveFontSize,
	saveLocale,
	saveAutoDarkMode
} from '../redux/settings'
import { setDarkMode } from '../redux/app'

import getMessages, {
	getLanguageNames
} from '../messages'

import UserSettings, {
	getCensoredWordsByLanguage
} from '../utility/settings'

// import { getProxyUrl } from '../chan'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()

export default function SettingsPage() {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const settings = useSelector(({ settings }) => settings.settings)
	const cookiesAccepted = useSelector(({ app }) => app.cookiesAccepted)
	return (
		<section className="settings-page content text-content">
			{/* Settings */}
			<h1 className="page__heading">
				{getMessages(locale).settings.title}
			</h1>
			{cookiesAccepted &&
				<Settings locale={locale} settings={settings}/>
			}
			{!cookiesAccepted &&
				<p className="settings-page__cookies-required">
					{getMessages(locale).cookies.required}
				</p>
			}
		</section>
	)
}

SettingsPage.meta = ({ settings }) => ({
	title: getMessages(settings.settings.locale).settings.title
})

function Settings({
	settings,
	locale
}) {
	const dispatch = useDispatch()
	const messages = getMessages(locale)
	const onSetDarkMode = useCallback(value => dispatch(setDarkMode(value)), [dispatch])
	const onLocaleChange = useCallback(locale => dispatch(saveLocale(locale)), [dispatch])
	const onFontSizeChange = useCallback(fontSize => dispatch(saveFontSize(fontSize)), [dispatch])
	const onAutoDarkModeChange = useCallback(darkMode => dispatch(saveAutoDarkMode(darkMode)), [dispatch])
	return (
		<ContentSections>
			{/* Language */}
			<LanguageSettings
				messages={messages}
				value={settings.locale}
				onChange={onLocaleChange}
				languages={LANGUAGE_NAMES}/>

			{/* Theme */}
			<ThemeSettings
				messages={messages}
				settings={settings}
				dispatch={dispatch}
				guideUrl="https://github.com/catamphetamine/captchan/blob/master/docs/themes/guide.md"/>

			{/* Dark Mode */}
			<DarkModeSettings
				messages={messages}
				autoDarkModeValue={settings.autoDarkMode}
				onAutoDarkModeChange={onAutoDarkModeChange}
				onSetDarkMode={onSetDarkMode}/>

			{/* Font Size */}
			<FontSizeSettings
				messages={messages}
				value={settings.fontSize}
				onChange={onFontSizeChange}/>

			{/* CORS Proxy URL */}
			{/*
			<ContentSection>
				<ContentSectionHeader lite>
					CORS Proxy URL
				</ContentSectionHeader>
				<Form onSubmit={saveCorsProxyUrl}>
					<Field
						readOnly
						name="corsProxyUrl"
						component={TextInput}
						value={getProxyUrl()}/>
				</Form>
			</ContentSection>
			*/}

			{/* Censored Words */}
			<CensoredWordsSettings
				messages={messages}
				language={settings.locale}
				getCensoredWordsByLanguage={getCensoredWordsByLanguage}/>

			{/* Data */}
			<DataSettings
				messages={messages}
				dispatch={dispatch}/>
		</ContentSections>
	)
}