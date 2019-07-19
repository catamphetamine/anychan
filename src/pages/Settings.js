import React from 'react'
import { connect } from 'react-redux'
import { meta } from 'react-website'
import { areCookiesAccepted } from 'webapp-frontend/src/utility/cookiePolicy'

import LanguageSettings from 'webapp-frontend/src/components/settings/LanguageSettings'
import FontSizeSettings from 'webapp-frontend/src/components/settings/FontSizeSettings'

import ThemeSettings from '../components/settings/ThemeSettings'
import DataSettings from '../components/settings/DataSettings'
import CensoredWordsSettings from '../components/settings/CensoredWordsSettings'

import {
	getSettings,
	resetSettings,
	replaceSettings,
	saveTheme,
	saveFontSize,
	saveLocale
} from '../redux/app'

import getMessages, {
	getLanguageNames
} from '../messages'

import {
	getCensoredWordsByLanguage
} from '../utility/settings'

// import { getProxyUrl } from '../chan'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { notify } from 'webapp-frontend/src/redux/notifications'
import { okCancelDialog } from 'webapp-frontend/src/redux/okCancelDialog'
import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()

@meta(({ app }) => ({
	title: getMessages(app.settings.locale).settings.title
}))
@connect(({ app }) => ({
	locale: app.settings.locale,
	settings: app.settings,
	cookiesAccepted: app.cookiesAccepted
}), {
	getSettings,
	resetSettings,
	replaceSettings,
	saveTheme,
	saveFontSize,
	saveLocale,
	notify,
	okCancelDialog
})
export default class SettingsPage extends React.Component {
	// async saveCorsProxyUrl({ corsProxyUrl }) {
	// 	console.log(corsProxyUrl)
	// 	alert('Not implemented')
	// 	// const { saveCorsProxyUrl } = this.props
	// 	// await saveCorsProxyUrl(corsProxyUrl)
	// }

	getMessages() {
		const { locale } = this.props
		return getMessages(locale)
	}

	render() {
		const {
			cookiesAccepted
		} = this.props

		return (
			<section className="settings-page content text-content">
				{/* Settings */}
				<h1 className="page__heading">
					{this.getMessages().settings.title}
				</h1>

				{cookiesAccepted && this.renderSettings()}

				{!cookiesAccepted &&
					<p className="settings-page__cookies-required">
						{this.getMessages().cookies.required}
					</p>
				}
			</section>
		)
	}

	renderSettings() {
		const {
			settings,
			saveLocale,
			saveTheme,
			saveFontSize,
			resetSettings,
			replaceSettings,
			okCancelDialog,
			notify
		} = this.props

		const messages = this.getMessages()

		return (
			<ContentSections>
				{/* Language */}
				<LanguageSettings
					messages={messages}
					value={settings.locale}
					onChange={saveLocale}
					languages={LANGUAGE_NAMES}/>

				{/* Theme */}
				<ThemeSettings
					messages={messages}
					value={settings.theme}
					onChange={saveTheme}
					guideUrl="https://github.com/catamphetamine/captchan/blob/master/docs/themes/guide.md"
					okCancelDialog={okCancelDialog}/>

				{/* Font Size */}
				<FontSizeSettings
					messages={messages}
					value={settings.fontSize}
					onChange={saveFontSize}/>

				{/* CORS Proxy URL */}
				{/*
				<ContentSection>
					<ContentSectionHeader lite>
						CORS Proxy URL
					</ContentSectionHeader>
					<Form onSubmit={this.saveCorsProxyUrl}>
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
					onResetSettings={resetSettings}
					onReplaceSettings={replaceSettings}
					okCancelDialog={okCancelDialog}
					notify={notify}/>
			</ContentSections>
		)
	}
}