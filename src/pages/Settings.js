import React, { useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

// import { areCookiesAccepted } from 'frontend-lib/utility/cookiePolicy.js'
import applyDarkMode from 'frontend-lib/utility/style/applyDarkMode.js'

import Heading from '../components/Heading.js'
import BackgroundSettings from '../components/settings/BackgroundSettings.js'
import ThemeSettings from '../components/settings/ThemeSettings.js'
import CssSettings from '../components/settings/CssSettings.js'
import ProxySettings from '../components/settings/ProxySettings.js'
import DataSettings from '../components/settings/DataSettings.js'
import KeyboardShortcuts from '../components/settings/KeyboardShortcuts.js'
import CensoredWordsSettings from '../components/settings/CensoredWordsSettings.js'
import GrammarCorrectionSettings from '../components/settings/GrammarCorrectionSettings.js'
import LanguageSettings from '../components/settings/LanguageSettings.js'
import FontSizeSettings from '../components/settings/FontSizeSettings.js'
import DarkModeSettings from '../components/settings/DarkModeSettings.js'
import LeftHandedSettings from '../components/settings/LeftHandedSettings.js'
import { FormComponent } from '../components/Form.js'

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

import getLanguageNames from '../messages/getLanguageNames.js'

import useMessages from '../hooks/useMessages.js'
import useSetting from '../hooks/useSetting.js'
import useSettings from '../hooks/useSettings.js'
import useMeasure from '../hooks/useMeasure.js'

import shouldUseProxy from '../utility/proxy/shouldUseProxy.js'
import { getDefaultProxyUrl } from '../utility/proxy/getProxyUrl.js'

import {
	ContentSections
} from 'frontend-lib/components/ContentSection.js'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()

export default function SettingsPage() {
	const messages = useMessages()

	const settings = useSetting(settings => settings)
	const cookiesAccepted = useSelector(state => state.app.cookiesAccepted)

	return (
		<section className="SettingsPage Content Content--text">
			{/* Settings */}
			<Heading onBackground>
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

SettingsPage.meta = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
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
	const measure = useMeasure()
	const dataSource = useDataSource()

	const onSetDarkMode = useCallback((value) => {
		// Apply `.dark`/`.light` CSS class to `<body/>`.
		applyDarkMode(value)
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
				value={settings.locale}
				onChange={onLocaleChange}
				languages={LANGUAGE_NAMES}>
				{/* "Adding a new language" guide. */}
				<FormComponent type="button">
					<a
						href="https://gitlab.com/catamphetamine/anychan/blob/master/docs/translation/guide.md"
						target="_blank">
						{messages.settings.language.translationGuide}
					</a>
				</FormComponent>
			</LanguageSettings>

			{/* Font Size */}
			<FontSizeSettings
				value={settings.fontSize}
				onChange={onFontSizeChange}/>

			{/* Theme */}
			<ThemeSettings
				settings={settings}
				guideUrl="https://gitlab.com/catamphetamine/anychan/blob/master/docs/themes/guide.md"/>

			{/* Background (Light) */}
			<BackgroundSettings
				type="light"
				settings={settings}/>

			{/* Background (Dark) */}
			<BackgroundSettings
				type="dark"
				settings={settings}/>

			{/* Dark Mode */}
			<DarkModeSettings
				autoDarkModeValue={settings.autoDarkMode}
				onAutoDarkModeChange={onAutoDarkModeChange}
				onSetDarkMode={onSetDarkMode}/>

			{/* Left Handed */}
			<LeftHandedSettings
				value={settings.leftHanded}
				onChange={onLeftHandedChange}/>

			{/* Grammar Correction */}
			<GrammarCorrectionSettings
				value={settings.grammarCorrection}
				onChange={onGrammarCorrectionChange}/>

			{/* Censored Words */}
			<CensoredWordsSettings language={getLanguageFromLocale(settings.locale)}/>

			{/* Keyboard Shortcuts */}
			<KeyboardShortcuts/>

			{/* Data */}
			<DataSettings/>

			{/* CORS Proxy */}
			{(!dataSource || shouldUseProxy(dataSource)) &&
				<ProxySettings
					value={settings.proxyUrl}
					defaultValue={getDefaultProxyUrl()}
					onChange={onProxyUrlChange}
				/>
			}

			{/* CSS */}
			<CssSettings value={settings.css}/>
		</ContentSections>
	)
}