import React from 'react'
import { connect } from 'react-redux'
import { preload, meta } from 'react-website'
import { Select, TextInput } from 'react-responsive-ui'
import { Form, Field } from 'easy-react-form'

import configuration from '../configuration'

import {
	getSettings,
	saveLocale,
	saveFontSize
} from '../redux/account'

import getMessages, { getLanguageNames } from '../messages'
import { applyFontSize } from '../utility/theme'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { notify } from 'webapp-frontend/src/redux/notifications'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()
const LANGUAGE_OPTIONS = Object.keys(LANGUAGE_NAMES).map((language) => ({
	value: language,
	label: LANGUAGE_NAMES[language]
}))

@meta(() => ({
	title: 'Settings'
}))
@connect(({ account }) => ({
	settings: account.settings
}), {
	saveLocale,
	saveFontSize,
	notify
})
@preload(({ dispatch }) => dispatch(getSettings()))
export default class SettingsPage extends React.Component {
	constructor() {
		super()
		this.saveCorsProxyUrl = this.saveCorsProxyUrl.bind(this)
	}

	async saveCorsProxyUrl({ corsProxyUrl }) {
		console.log(corsProxyUrl)
		alert('Not implemented')
		// const { saveCorsProxyUrl } = this.props
		// await saveCorsProxyUrl(corsProxyUrl)
	}

	saveFontSize = (fontSize) => {
		const { saveFontSize } = this.props
		if (applyFontSize(fontSize)) {
			saveFontSize(fontSize)
		} else {
			notify('Your browser doesn\'t support CSS variables', { type: 'error' })
		}
	}

	render() {
		const { settings, saveLocale } = this.props
		const messages = getMessages(settings.locale)

		return (
			<section className="settings-page content content--posts">
				{/* Settings */}
				<h1 className="page__heading">
					{messages.settings.title}
				</h1>

				{/* Language */}
				<ContentSections>
					<ContentSection>
						<ContentSectionHeader lite>
							{messages.settings.language}
						</ContentSectionHeader>

						<Select
							value={settings.locale}
							options={LANGUAGE_OPTIONS}
							onChange={saveLocale}/>
					</ContentSection>

					{/* Font Size */}
					<ContentSection>
						<ContentSectionHeader lite>
							{messages.settings.fontSize.title}
						</ContentSectionHeader>

						<Select
							value={settings.fontSize}
							options={getFontSizeOptions(settings.locale)}
							onChange={this.saveFontSize}/>
					</ContentSection>

					{/* CORS Proxy URL */}
					<ContentSection>
						<ContentSectionHeader lite>
							CORS Proxy URL
						</ContentSectionHeader>

						<Form onSubmit={this.saveCorsProxyUrl}>
							<Field
								name="corsProxyUrl"
								component={TextInput}
								value={configuration.corsProxyUrl}/>
						</Form>
					</ContentSection>

					{/* Filters */}
					<ContentSection>
						<ContentSectionHeader lite>
							{messages.settings.filters}
						</ContentSectionHeader>
						<pre>
							{JSON.stringify(settings.filters, null, 2)}
						</pre>
					</ContentSection>
				</ContentSections>
			</section>
		)
	}
}

function getFontSizeOptions(locale) {
	const fontSizes = getMessages(locale).settings.fontSize
	return Object.keys(fontSizes)
		.filter(_ => _ !== 'title')
		.map((fontSize) => ({
			value: fontSize,
			label: fontSizes[fontSize]
		}))
}