import React from 'react'
import { connect } from 'react-redux'
import { preload, meta } from 'react-website'

import configuration from '../configuration'
import { getSettings, saveSettings } from '../redux/account'

import './Settings.css'

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
		return (
			<section className="container">
				<h1>Settings</h1>
				<form onSubmit={this.onSubmit}>
					<h3>Chan API URL (proxied)</h3>
					<pre>
						{configuration.chanApiBaseURL}
					</pre>

					<h3>Filters</h3>
					<pre>
						{JSON.stringify(settings.filters, null, 2)}
					</pre>
				</form>
			</section>
		)
	}
}