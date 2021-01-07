import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'

import LanguageSettings from 'webapp-frontend/src/components/settings/LanguageSettings'
import FontSizeSettings from 'webapp-frontend/src/components/settings/FontSizeSettings'
import DarkModeSettings from 'webapp-frontend/src/components/settings/DarkModeSettings'
import LeftHandedSettings from 'webapp-frontend/src/components/settings/LeftHandedSettings'

import Heading from '../components/Heading'
import ThemeSettings from '../components/settings/ThemeSettings'
import ProxySettings from '../components/settings/ProxySettings'
import DataSettings from '../components/settings/DataSettings'
import CensoredWordsSettings from '../components/settings/CensoredWordsSettings'
import GrammarCorrectionSettings from '../components/settings/GrammarCorrectionSettings'

import getLanguageFromLocale from '../utility/getLanguageFromLocale'

import {
	saveFontSize,
	saveLocale,
	saveAutoDarkMode,
	saveLeftHanded,
	saveGrammarCorrection,
	saveProxyUrl
} from '../redux/settings'

import { setDarkMode } from '../redux/app'

import getMessages, {
	getLanguageNames
} from '../messages'

import UserSettings from '../utility/settings'

import { shouldUseProxy, getProxyUrl } from '../utility/proxy'

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
		<section className="SettingsPage Content Content--text">
			{/* Settings */}
			<Heading>
				{getMessages(locale).settings.title}
			</Heading>
			{cookiesAccepted &&
				<Settings locale={locale} settings={settings}/>
			}
			{!cookiesAccepted &&
				<p className="SettingsPage-cookiesRequired">
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
	const onLeftHandedChange = useCallback(leftHanded => dispatch(saveLeftHanded(leftHanded)), [dispatch])
	const onGrammarCorrectionChange = useCallback(grammarCorrection => dispatch(saveGrammarCorrection(grammarCorrection)), [dispatch])
	const onProxyUrlChange = useCallback(value => dispatch(saveProxyUrl(value)), [dispatch])
	return (
		<ContentSections>
			{/* Language */}
			<LanguageSettings
				messages={messages}
				value={settings.locale}
				onChange={onLocaleChange}
				languages={LANGUAGE_NAMES}>
				{/* "Adding a new language" guide. */}
				<div className="form__component form__component--button">
					<a
						href="https://gitlab.com/catamphetamine/captchan/blob/master/docs/translation/guide.md"
						target="_blank">
						{messages.settings.language.translationGuide}
					</a>
				</div>
			</LanguageSettings>

			{/* Theme */}
			<ThemeSettings
				messages={messages}
				settings={settings}
				dispatch={dispatch}
				guideUrl="https://gitlab.com/catamphetamine/captchan/blob/master/docs/themes/guide.md"/>

			{/* Font Size */}
			<FontSizeSettings
				messages={messages}
				value={settings.fontSize}
				onChange={onFontSizeChange}/>

			{/* Dark Mode */}
			<DarkModeSettings
				messages={messages}
				autoDarkModeValue={settings.autoDarkMode}
				onAutoDarkModeChange={onAutoDarkModeChange}
				onSetDarkMode={onSetDarkMode}/>

			{/* Left Handed */}
			<LeftHandedSettings
				messages={messages}
				value={settings.leftHanded}
				onChange={onLeftHandedChange}/>

			{/* Grammar Correction */}
			<GrammarCorrectionSettings
				messages={messages}
				value={settings.grammarCorrection}
				onChange={onGrammarCorrectionChange}/>

			{/* Censored Words */}
			<CensoredWordsSettings
				messages={messages}
				language={getLanguageFromLocale(settings.locale)}/>

			{/* Data */}
			<DataSettings
				messages={messages}
				dispatch={dispatch}/>

			{/* CORS Proxy */}
			{shouldUseProxy() &&
				<ProxySettings
					messages={messages}
					value={settings.proxyUrl}
					defaultValue={getProxyUrl()}
					onChange={onProxyUrlChange}/>
			}
		</ContentSections>
	)
}