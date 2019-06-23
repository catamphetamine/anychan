import React from 'react'
import { connect } from 'react-redux'
import { preload, meta } from 'react-website'
import { Button, Select, TextInput } from 'react-responsive-ui'
import { Form, Field } from 'easy-react-form'

import configuration from '../configuration'

import {
	getSettings,
	resetSettings,
	saveLocale,
	saveFontSize
} from '../redux/app'

import getMessages, { getLanguageNames } from '../messages'

import {
	FONT_SIZES,
	applyFontSize,
	getIgnoredWordsByLanguage
} from '../utility/settings'

import UserData from '../utility/UserData'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { notify } from 'webapp-frontend/src/redux/notifications'

import { clearCache as clearYouTubeCache } from 'webapp-frontend/src/utility/video-youtube-cache'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()
const LANGUAGE_OPTIONS = Object.keys(LANGUAGE_NAMES).map((language) => ({
	value: language,
	label: LANGUAGE_NAMES[language]
}))

@meta(() => ({
	title: 'Settings'
}))
@connect(({ app }) => ({
	settings: app.settings
}), {
	resetSettings,
	saveLocale,
	saveFontSize,
	notify
})
@preload(({ dispatch }) => dispatch(getSettings()))
export default class SettingsPage extends React.Component {
	state = {
		showIgnoredWords: false
	}

	constructor() {
		super()
		this.saveCorsProxyUrl = this.saveCorsProxyUrl.bind(this)
	}

	showIgnoredWords = () => {
		this.setState({
			showIgnoredWords: true
		})
	}

	async saveCorsProxyUrl({ corsProxyUrl }) {
		console.log(corsProxyUrl)
		alert('Not implemented')
		// const { saveCorsProxyUrl } = this.props
		// await saveCorsProxyUrl(corsProxyUrl)
	}

	saveFontSize = (fontSize) => {
		const { saveFontSize } = this.props
		applyFontSize(fontSize)
		saveFontSize(fontSize)
	}

	render() {
		const { settings, saveLocale, resetSettings } = this.props
		const { showIgnoredWords } = this.state
		const messages = getMessages(settings.locale)

		return (
			<section className="settings-page content text-content">
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
							{messages.settings.filters.title}
						</ContentSectionHeader>
						<div className="settings-page__filters-docs">
							{messages.settings.filters.docs.titleStart}
							<a
								target="_blank"
								href="https://www.regexpal.com/"
								className="settings-page__filters-practice-link">
								{messages.settings.filters.docs.titleRegExps}
							</a>
							{messages.settings.filters.docs.titleEnd}:
							<ul className="settings-page__filters-tips">
								<li>
									<code>^</code> — {messages.settings.filters.docs.tips.start}.
								</li>
								<li>
									<code>$</code> — {messages.settings.filters.docs.tips.end}.
								</li>
								<li>
									<code>.</code> — {messages.settings.filters.docs.tips.any}.
								</li>
								<li>
									<code>[abc]</code> — {messages.settings.filters.docs.tips.anyOf}: <code>a</code>, <code>b</code>, <code>c</code>.
								</li>
								<li>
									<code>a?</code> — {messages.settings.filters.docs.tips.optional} <code>a</code>.
								</li>
								<li>
									<code>.*</code> — {messages.settings.filters.docs.tips.anyCountOf}.
								</li>
								<li>
									<code>.+</code> — {messages.settings.filters.docs.tips.oneOrMoreOf}.
								</li>
								<li>
									<code>{'.{0,2}'}</code> — {messages.settings.filters.docs.tips.rangeCountOf}.
								</li>
							</ul>
						</div>
						{!showIgnoredWords &&
							<Button
								onClick={this.showIgnoredWords}
								className="rrui__button--inline">
								{messages.settings.filters.showCensoredWordsList}
							</Button>
						}
						{showIgnoredWords &&
							<pre className="settings-page__filters">
								{getIgnoredWordsByLanguage(settings.locale).join('\n')}
							</pre>
						}
					</ContentSection>

					{/* Data */}
					<ContentSection>
						<ContentSectionHeader lite>
							{messages.settings.data.title}
						</ContentSectionHeader>
						<div className="settings-page__button-row">
							<Button
								onClick={resetSettings}
								className="rrui__button--auto-height">
								{messages.settings.data.resetSettings}
							</Button>
						</div>
						<div className="settings-page__button-row">
							<Button
								onClick={UserData.clear}
								className="rrui__button--auto-height">
								{messages.settings.data.clearUserData}
							</Button>
						</div>
						<div className="settings-page__button-row">
							<Button
								onClick={clearYouTubeCache}
								className="rrui__button--auto-height">
								{messages.settings.data.clearYouTubeCache}
							</Button>
						</div>
					</ContentSection>
				</ContentSections>
			</section>
		)
	}
}

function getFontSizeOptions(locale) {
	return FONT_SIZES.map((fontSize) => ({
		value: fontSize,
		label: getMessages(locale).settings.fontSize[fontSize]
	}))
}