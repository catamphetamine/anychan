import React from 'react'
import { connect } from 'react-redux'
import { meta } from 'react-website'
import { Modal, Button, Switch, Select, TextInput, FileUploadButton } from 'react-responsive-ui'
import { Form, Field, Submit } from 'webapp-frontend/src/components/Form'
import saveFile from 'webapp-frontend/src/utility/saveFile'
import readTextFile from 'webapp-frontend/src/utility/readTextFile'

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
	THEMES,
	FONT_SIZES,
	applySettings,
	getThemes,
	isBuiltInTheme,
	addTheme,
	removeTheme,
	applyTheme,
	applyFontSize,
	getIgnoredWordsByLanguage,
	getSettingsData
} from '../utility/settings'

// import { getProxyUrl } from '../chan'

import UserData from '../utility/UserData'

import {
	ContentSections,
	ContentSection,
	ContentSectionHeader
} from 'webapp-frontend/src/components/ContentSection'

import { notify } from 'webapp-frontend/src/redux/notifications'
import { okCancelDialog } from 'webapp-frontend/src/redux/okCancelDialog'
import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'
import { clearCache as clearYouTubeCache } from 'webapp-frontend/src/utility/video-youtube-cache'
import { validateUrl } from 'webapp-frontend/src/utility/url'

import './Settings.css'

const LANGUAGE_NAMES = getLanguageNames()
const LANGUAGE_OPTIONS = Object.keys(LANGUAGE_NAMES).map((language) => ({
	value: language,
	label: LANGUAGE_NAMES[language]
}))

const CSS_URL_REGEXP = /\.css$/

@meta(() => ({
	title: 'Settings'
}))
@connect(({ app }) => ({
	locale: app.settings.locale,
	settings: app.settings
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
	state = {
		showIgnoredWords: false
	}

	addThemeForm = React.createRef()

	constructor() {
		super()
		this.addTheme = this.addTheme.bind(this)
		this.saveTheme = this.saveTheme.bind(this)
		this.onResetSettings = this.onResetSettings.bind(this)
		this.onImport = this.onImport.bind(this)
		this.onAddUserData = this.onAddUserData.bind(this)
		this.onClearUserData = this.onClearUserData.bind(this)
		this.deleteCurrentTheme = this.deleteCurrentTheme.bind(this)
		// this.saveCorsProxyUrl = this.saveCorsProxyUrl.bind(this)
	}

	showIgnoredWords = () => {
		this.setState({
			showIgnoredWords: true
		})
	}

	// async saveCorsProxyUrl({ corsProxyUrl }) {
	// 	console.log(corsProxyUrl)
	// 	alert('Not implemented')
	// 	// const { saveCorsProxyUrl } = this.props
	// 	// await saveCorsProxyUrl(corsProxyUrl)
	// }

	async saveTheme(name) {
		const { saveTheme } = this.props
		await applyTheme(name)
		saveTheme(name)
	}

	saveFontSize = (fontSize) => {
		const { saveFontSize } = this.props
		applyFontSize(fontSize)
		saveFontSize(fontSize)
	}

	async onResetSettings() {
		const {
			locale,
			resetSettings,
			notify,
			okCancelDialog
		} = this.props
		const messages = getMessages(locale)
		okCancelDialog(messages.settings.data.resetSettings.warning)
		if (await OkCancelDialog.getPromise()) {
			resetSettings()
			applySettings()
			notify(messages.settings.data.resetSettings.done)
		}
	}

	async onClearUserData() {
		const {
			locale,
			notify,
			okCancelDialog
		} = this.props
		const messages = getMessages(locale)
		okCancelDialog(messages.settings.data.clearUserData.warning)
		if (await OkCancelDialog.getPromise()) {
			UserData.clear()
			notify(messages.settings.data.clearUserData.done)
		}
	}

	onShowAddThemeModal = () => {
		this.setState({
			showAddThemeModal: true
		})
	}

	showAddThemeModal = () => {
		this.setState({
			showAddThemeModal: true
		})
	}

	hideAddThemeModal = () => {
		this.setState({
			showAddThemeModal: false,
			pasteCodeInstead: false
		})
	}

	async addTheme(theme) {
		const { locale } = this.props
		try {
			if (theme.code) {
				delete theme.url
			}
			await applyTheme(theme)
			await addTheme(theme)
			await this.saveTheme(theme.name)
			this.hideAddThemeModal()
		} catch (error) {
			console.error(error)
			if (error.message === 'STYLESHEET_ERROR') {
				const messages = getMessages(locale)
				throw new Error(messages.settings.theme.add.cssFileError)
			}
			throw error
		}
	}

	async deleteCurrentTheme() {
		const {
			settings: { theme },
			locale,
			okCancelDialog
		} = this.props
		const messages = getMessages(locale)
		okCancelDialog(messages.settings.theme.deleteCurrent.warning.replace('{0}', theme))
		if (await OkCancelDialog.getPromise()) {
			removeTheme(theme)
			this.saveTheme()
		}
	}

	pasteCodeInstead = () => {
		this.setState({
			pasteCodeInstead: true
		}, () => {
			this.addThemeForm.current.getWrappedInstance().focus('code')
		})
	}

	validateCssUrl = (value) => {
		const { settings } = this.props
		const messages = getMessages(settings.locale)
		if (!validateUrl(value)) {
			return messages.settings.theme.add.invalidUrl
		}
		if (!CSS_URL_REGEXP.test(value)) {
			return messages.settings.theme.add.invalidExtension
		}
	}

	onExport = () => {
		const { settings, notify } = this.props
		const messages = getMessages(settings.locale)
		saveFile(
			JSON.stringify({
				settings: getSettingsData(),
				userData: UserData.get()
			}, null, 2),
			'captchan-settings.json'
		)
	}

	async onImport(file) {
		const {
			locale,
			notify,
			okCancelDialog,
			replaceSettings
		} = this.props
		const messages = getMessages(locale)
		const text = await readTextFile(file)
		let json
		try {
			json = JSON.parse(text)
		} catch (error) {
			return notify(messages.settings.data.import.error, { type: 'error' })
		}
		const { settings, userData } = json
		okCancelDialog(messages.settings.data.import.warning)
		if (await OkCancelDialog.getPromise()) {
			replaceSettings(settings)
			UserData.replace(userData)
			applySettings()
			notify(messages.settings.data.import.done)
		}
	}

	async onAddUserData(file) {
		const { settings: { locale }, notify } = this.props
		const messages = getMessages(locale)
		const text = await readTextFile(file)
		let json
		try {
			json = JSON.parse(text)
		} catch (error) {
			return notify(messages.settings.data.import.error, { type: 'error' })
		}
		const { settings, userData } = json
		UserData.merge(userData)
		notify(messages.settings.data.merge.done)
	}

	render() {
		const {
			settings,
			saveLocale
		} = this.props

		const {
			showIgnoredWords,
			showAddThemeModal,
			pasteCodeInstead
		} = this.state

		const messages = getMessages(settings.locale)

		return (
			<section className="settings-page content text-content">
				{/* Settings */}
				<h1 className="page__heading">
					{messages.settings.title}
				</h1>

				<ContentSections>
					{/* Language */}
					<ContentSection>
						<ContentSectionHeader lite>
							{messages.settings.language}
						</ContentSectionHeader>
						<Select
							value={settings.locale}
							options={LANGUAGE_OPTIONS}
							onChange={saveLocale}/>
					</ContentSection>

					{/* Theme */}
					<ContentSection>
						<ContentSectionHeader lite>
							{messages.settings.theme.title}
						</ContentSectionHeader>

						<div className="form">
							<Select
								value={settings.theme}
								options={getThemeOptions(settings.locale)}
								onChange={this.saveTheme}
								className="form__component"/>
							<div className="form__component form__component--button">
								<Button
									onClick={this.showAddThemeModal}
									className="rrui__button--text">
									{messages.settings.theme.add.title}
								</Button>
							</div>
							<div className="form__component form__component--button">
								<a
									href="https://github.com/catamphetamine/captchan/blob/master/docs/themes/guide.md"
									target="_blank">
									{messages.settings.theme.readThemesGuide}
								</a>
							</div>
							{!isBuiltInTheme(settings.theme) &&
								<div className="form__component form__component--button">
									<Button
										onClick={this.deleteCurrentTheme}
										className="rrui__button--text">
										{messages.settings.theme.deleteCurrent.title}
									</Button>
								</div>
							}
						</div>

						<Modal
							isOpen={showAddThemeModal}
							close={this.hideAddThemeModal}>
							<Modal.Title>
								{messages.settings.theme.add.title}
							</Modal.Title>
							<Modal.Content>
								<Form
									autoFocus
									ref={this.addThemeForm}
									requiredMessage={messages.form.error.required}
									onSubmit={this.addTheme}
									className="form">
									<Field
										required
										name="name"
										label={messages.settings.theme.add.name}
										component={TextInput}
										className="form__component"/>
									{!pasteCodeInstead &&
										<Field
											required
											name="url"
											label={messages.settings.theme.add.url}
											validate={this.validateCssUrl}
											component={TextInput}
											className="form__component"/>
									}
									{!pasteCodeInstead &&
										<Button
											onClick={this.pasteCodeInstead}
											className="rrui__button--text form__component">
											{messages.settings.theme.add.pasteCodeInstead}
										</Button>
									}
									{pasteCodeInstead &&
										<Field
											required
											multiline
											name="code"
											label={messages.settings.theme.add.code}
											component={TextInput}
											className="form__component rrui__input--monospace"/>
									}
									<div className="form__actions">
										<Button
											onClick={this.hideAddThemeModal}
											className="rrui__button--text form__action">
											{messages.actions.cancel}
										</Button>

										<Submit
											submit
											component={Button}
											className="rrui__button--background form__action">
											{messages.actions.add}
										</Submit>
									</div>
								</Form>
							</Modal.Content>
						</Modal>
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
								className="rrui__button--text">
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
						<p className="content-section__description">
							{messages.settings.data.description}
						</p>
						<div className="form">
							<div className="form__component form__component--button">
								<Button
									onClick={this.onResetSettings}
									className="rrui__button--text">
									{messages.settings.data.resetSettings.title}
								</Button>
							</div>
							<div className="form__component form__component--button">
								<Button
									onClick={this.onClearUserData}
									className="rrui__button--text">
									{messages.settings.data.clearUserData.title}
								</Button>
							</div>
							<div className="form__component form__component--button">
								<Button
									onClick={clearYouTubeCache}
									className="rrui__button--text">
									{messages.settings.data.clearYouTubeCache.title}
								</Button>
							</div>
							<br/>
							<div className="form__component form__component--button">
								<Button
									onClick={this.onExport}
									className="rrui__button--text rrui__button--multiline">
									{messages.settings.data.export.title}
								</Button>
							</div>
							<div className="form__component form__component--button">
								<FileUploadButton
									accept=".json"
									component={Button}
									onChange={this.onImport}
									className="rrui__button--text rrui__button--multiline">
									{messages.settings.data.import.title}
								</FileUploadButton>
							</div>
							<br/>
							<div className="form__component form__component--button">
								<FileUploadButton
									accept=".json"
									component={Button}
									onChange={this.onAddUserData}
									className="rrui__button--text rrui__button--multiline">
									{messages.settings.data.merge.title}
								</FileUploadButton>
							</div>
							<p className="form__component form__component--description">
								{messages.settings.data.merge.description}
							</p>
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

function getThemeOptions(locale) {
	return getThemes().map((theme) => ({
		value: theme.name,
		label: getMessages(locale).settings.theme.themes[theme.name] || theme.name
	}))
}