import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'

import Heading from '../components/Heading.js'
import ThemeSettings from '../components/settings/ThemeSettings.js'
import ProxySettings from '../components/settings/ProxySettings.js'
import DataSettings from '../components/settings/DataSettings.js'
import KeyboardShortcuts from '../components/settings/KeyboardShortcuts.js'
import CensoredWordsSettings from '../components/settings/CensoredWordsSettings.js'
import GrammarCorrectionSettings from '../components/settings/GrammarCorrectionSettings.js'
import LanguageSettings from '../components/settings/LanguageSettings.js'
import FontSizeSettings from '../components/settings/FontSizeSettings.js'
import DarkModeSettings from '../components/settings/DarkModeSettings.js'
import LeftHandedSettings from '../components/settings/LeftHandedSettings.js'

import getLanguageFromLocale from '../utility/getLanguageFromLocale.js'

import {
	saveFontSize,
	saveLocale,
	saveAutoDarkMode,
	saveLeftHanded,
	saveGrammarCorrection,
	saveProxyUrl
} from '../redux/settings.js'

import useDataSource from '../hooks/useDataSource.js'

import { setDarkMode } from '../redux/app.js'

import { getLanguageNames } from '../messages/index.js'

import useMessages from '../hooks/useMessages.js'
import useLocale from '../hooks/useLocale.js'
import useSetting from '../hooks/useSetting.js'
import useSettings from '../hooks/useSettings.js'
import useMeasure from '../hooks/useMeasure.js'

import shouldUseProxy from '../utility/proxy/shouldUseProxy.js'
import getProxyUrl from '../utility/proxy/getProxyUrl.js'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()

export default function SettingsPage(props) {
	const messages = useMessages()
	const settings = useSetting(settings => settings)
	const cookiesAccepted = useSelector(state => state.app.cookiesAccepted)
	return (
		<section className="SettingsPage Content Content--text">
			{/* Settings */}
			<Heading>
				{messages.settings.title}
			</Heading>
			{cookiesAccepted &&
				<Settings settings={settings}/>
			}
			{!cookiesAccepted &&
				<p className="SettingsPage-cookiesRequired">
					{messages.cookies.required}
				</p>
			}
		</section>
	)
}

SettingsPage.meta = ({ useSelector, props }) => {
	const messages = useMessages({ useSelector })
	const locale = useSelector(state => state.settings.settings.locale)
	return {
		title: messages.settings.title
	}
}

function Settings({
	settings
}) {
	const dispatch = useDispatch()
	const userSettings = useSettings()
	const messages = useMessages()
	const locale = useLocale()
	const measure = useMeasure()
	const dataSource = useDataSource()

	const onSetDarkMode = useCallback((value) => {
		dispatch(setDarkMode(value))
		measure()
	}, [
		dispatch,
		measure
	])

	const onLocaleChange = useCallback(locale => dispatch(saveLocale({ locale, userSettings })), [dispatch, userSettings])
	const onFontSizeChange = useCallback(fontSize => dispatch(saveFontSize({ fontSize, userSettings })), [dispatch, userSettings])
	const onAutoDarkModeChange = useCallback(autoDarkMode => dispatch(saveAutoDarkMode({ autoDarkMode, userSettings })), [dispatch, userSettings])
	const onLeftHandedChange = useCallback(leftHanded => dispatch(saveLeftHanded({ leftHanded, userSettings })), [dispatch, userSettings])
	const onGrammarCorrectionChange = useCallback(grammarCorrection => dispatch(saveGrammarCorrection({ grammarCorrection, userSettings })), [dispatch, userSettings])
	const onProxyUrlChange = useCallback(proxyUrl => dispatch(saveProxyUrl({ proxyUrl, userSettings })), [dispatch, userSettings])

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
						href="https://gitlab.com/catamphetamine/anychan/blob/master/docs/translation/guide.md"
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
				guideUrl="https://gitlab.com/catamphetamine/anychan/blob/master/docs/themes/guide.md"/>

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

			{/* Keyboard Shortcuts */}
			<KeyboardShortcuts
				messages={messages}/>

			{/* Data */}
			<DataSettings
				messages={messages}
				locale={settings.locale}
				dispatch={dispatch}
			/>

			{/* CORS Proxy */}
			{shouldUseProxy(dataSource) &&
				<ProxySettings
					messages={messages}
					value={settings.proxyUrl}
					defaultValue={getProxyUrl({ userSettings })}
					onChange={onProxyUrlChange}
				/>
			}
		</ContentSections>
	)
}