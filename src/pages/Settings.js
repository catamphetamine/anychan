import React from 'react'
import { connect } from 'react-redux'
import { preload, meta } from 'react-website'

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
		this.onSubmit = this.onSubmit.bind(this)
	}

	async onSubmit(values) {
		const { saveSettings } = this.props
		await saveSettings(values)
	}

	render() {
		const { settings } = this.props
		return (
			<form onSubmit={this.onSubmit}>
				{JSON.stringify(settings)}
			</form>
		)
	}
}