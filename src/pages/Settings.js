import React from 'react'
import { connect } from 'react-redux'
import { preload, meta } from 'react-website'
import { Select, TextInput } from 'react-responsive-ui'

import configuration from '../configuration'
import { getSettings, saveSettings } from '../redux/account'
import getMessages, { getLanguageNames } from '../messages'

import {
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

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
	saveSettings
})
@preload(({ dispatch }) => dispatch(getSettings()))
export default class SettingsPage extends React.Component {
	constructor() {
		super()
		this.onSubmit = this.onSubmit.bind(this)
	}

	async onSubmit(values) {
		const { saveSettings } = this.props
		await saveSettings(values)
	}

	render() {
		const { settings } = this.props
		const messages = getMessages(settings.locale)
		return (
			<section className="container">
				<h1 className="page__header">
					Settings
				</h1>
				<form onSubmit={this.onSubmit}>
					{/* Language */}
					<ContentSection>
						<ContentSectionHeader>
							{messages.settings.language}
						</ContentSectionHeader>

						<Select
							value={settings.locale}
							options={LANGUAGE_OPTIONS}/>
					</ContentSection>

					{/* CORS Proxy URL */}
					<ContentSection>
						<ContentSectionHeader>
							CORS Proxy URL
						</ContentSectionHeader>

						<TextInput
							value={configuration.corsProxyUrl}
							onChange={() => {}}/>
					</ContentSection>

					{/* Filters */}
					<ContentSection>
						<ContentSectionHeader>
							{messages.settings.filters}
						</ContentSectionHeader>
						<pre>
							{JSON.stringify(settings.filters, null, 2)}
						</pre>
					</ContentSection>
				</form>
			</section>
		)
	}
}