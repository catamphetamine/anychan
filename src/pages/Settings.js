import React from 'react'
import { connect } from 'react-redux'
import { preload, meta } from 'react-website'
import { Select, TextInput } from 'react-responsive-ui'
import { Form, Field } from 'easy-react-form'

import configuration from '../configuration'
import { getSettings, saveLocale } from '../redux/account'
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
	saveLocale
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

	render() {
		const { settings, saveLocale } = this.props
		const messages = getMessages(settings.locale)
		return (
			<section className="container">
				{/* Settings */}
				<h1 className="page__header">
					{messages.settings.title}
				</h1>

				{/* Language */}
				<ContentSection>
					<ContentSectionHeader>
						{messages.settings.language}
					</ContentSectionHeader>

					<Select
						value={settings.locale}
						options={LANGUAGE_OPTIONS}
						onChange={saveLocale}/>
				</ContentSection>

				{/* CORS Proxy URL */}
				<ContentSection>
					<ContentSectionHeader>
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
					<ContentSectionHeader>
						{messages.settings.filters}
					</ContentSectionHeader>
					<pre>
						{JSON.stringify(settings.filters, null, 2)}
					</pre>
				</ContentSection>
			</section>
		)
	}
}