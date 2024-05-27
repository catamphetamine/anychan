import type { Locale, PageMetaFunction } from '@/types'

import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'

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

import { setDarkMode } from '../redux/app.js'

import getLanguageNames from '../messages/getLanguageNames.js'

import useMessages from '../hooks/useMessages.js'
import useSetting from '../hooks/useSetting.js'
import useSettingUpdater from '../hooks/useSettingUpdater.js'
import useMeasure from '../hooks/useMeasure.js'
import useProxyRequired from '../hooks/useProxyRequired.js'
import useSelector from '../hooks/useSelector.js'

import { getDefaultProxyUrl } from '../utility/proxy/getProxyUrl.js'

import {
	ContentSections
} from 'frontend-lib/components/ContentSection.js'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()

export default function SettingsPage() {
	const messages = useMessages()

	const cookiesAccepted = useSelector(state => state.app.cookiesAccepted)

	return (
		<section className="SettingsPage Content Content--text">
			<Heading onBackground>
				{messages.settings.title}
			</Heading>
			{cookiesAccepted &&
				<Settings/>
			}
			{!cookiesAccepted &&
				<p className="SettingsPage-cookiesRequired">
					{messages.cookies.required}
				</p>
			}
		</section>
	)
}

const meta: PageMetaFunction = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.settings.title
	}
}

SettingsPage.meta = meta

function Settings() {
	const settings = useSetting(settings => settings)
	const dispatch = useDispatch()
	const messages = useMessages()
	const measure = useMeasure()
	const proxyRequired = useProxyRequired()

	const onSetDarkMode = useCallback((value: boolean) => {
		// Apply `.dark`/`.light` CSS class to `<body/>`.
		applyDarkMode(value)
		dispatch(setDarkMode(value))
		measure()
	}, [
		dispatch,
		measure
	])

	const onLocaleChange = useSettingUpdater('locale')
	const onFontSizeChange = useSettingUpdater('fontSize')
	const onAutoDarkModeChange = useSettingUpdater('autoDarkMode')
	const onLeftHandedChange = useSettingUpdater('leftHanded')
	const onGrammarCorrectionChange = useSettingUpdater('grammarCorrection')
	const onBackgroundLightModeChange = useSettingUpdater('backgroundLightMode')
	const onBackgroundDarkModeChange = useSettingUpdater('backgroundDarkMode')
	const onThemeChange = useSettingUpdater('theme')
	const onCssChange = useSettingUpdater('css')
	const onProxyUrlChange = useSettingUpdater('proxyUrl')

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
				onChange={onFontSizeChange}
			/>

			{/* Theme */}
			<ThemeSettings
				value={settings.theme}
				onChange={onThemeChange}
				guideUrl="https://gitlab.com/catamphetamine/anychan/blob/master/docs/themes/guide.md"
			/>

			{/* Background (Light) */}
			<BackgroundSettings
				type="light"
				value={settings.backgroundLightMode}
				onChange={onBackgroundLightModeChange}
			/>

			{/* Background (Dark) */}
			<BackgroundSettings
				type="dark"
				value={settings.backgroundDarkMode}
				onChange={onBackgroundDarkModeChange}
			/>

			{/* Dark Mode */}
			<DarkModeSettings
				autoDarkModeValue={settings.autoDarkMode}
				onAutoDarkModeChange={onAutoDarkModeChange}
				onSetDarkMode={onSetDarkMode}
			/>

			{/* Left Handed */}
			<LeftHandedSettings
				value={settings.leftHanded}
				onChange={onLeftHandedChange}
			/>

			{/* Grammar Correction */}
			<GrammarCorrectionSettings
				value={settings.grammarCorrection}
				onChange={onGrammarCorrectionChange}
			/>

			{/* Censored Words */}
			<CensoredWordsSettings language={getLanguageFromLocale(settings.locale) as Locale}/>

			{/* Keyboard Shortcuts */}
			<KeyboardShortcuts/>

			{/* Data */}
			<DataSettings/>

			{/* CORS Proxy */}
			{proxyRequired &&
				<ProxySettings
					value={settings.proxyUrl}
					defaultValue={getDefaultProxyUrl()}
					onChange={onProxyUrlChange}
				/>
			}

			{/* CSS */}
			<CssSettings
				value={settings.css}
				onChange={onCssChange}
			/>
		</ContentSections>
	)
}
