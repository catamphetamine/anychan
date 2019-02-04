import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, preload, Loading } from 'react-website'

// Not importing `Tooltip.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-time-ago/Tooltip.css'
import 'react-website/components/Loading.css'
// Not importing `LoadingIndicator.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-website/components/LoadingIndicator.css'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Snackbar from 'webapp-frontend/src/components/Snackbar'
import Slideshow from 'webapp-frontend/src/components/Slideshow'

// `react-time-ago` languages.
import { setDefaultLocale } from 'webapp-frontend/src/components/TimeAgo'
import 'webapp-frontend/src/components/TimeAgo.en'
import 'webapp-frontend/src/components/TimeAgo.ru'

import { closeSlideshow } from 'webapp-frontend/src/redux/slideshow'

import { getBoards } from '../redux/chan'
import { getSettings } from '../redux/account'

import getMessages from '../messages'

import './Application.css'

@meta((state) => ({
	locale: getHTMLLocaleFromLanguage(state.account.settings.locale)
}))
@connect(({ slideshow }) => ({
	slideshowIndex: slideshow.index,
	slideshowIsOpen: slideshow.isOpen,
	slideshowPictures: slideshow.pictures
}), {
	closeSlideshow
})
@preload(async ({ dispatch, getState }) => {
	const settings = await dispatch(getSettings())
	// // `react-time-ago` language.
	// setDefaultLocale(settings.locale)
	try {
		await dispatch(getBoards())
	} catch (error) {
		alert(getMessages(getState().account.settings.locale).loadingBoardsError)
	}
}, {
	blocking: true
})
export default class App extends React.Component
{
	static propTypes = {
		children : PropTypes.node.isRequired
	}

	render() {
		const {
			slideshowIndex,
			slideshowIsOpen,
			slideshowPictures,
			closeSlideshow,
			children
		} = this.props

		return (
			<div>
				{/* Page loading indicator */}
				<Loading/>

				{/* Pop-up messages */}
				<Snackbar/>

				{/* Picture Slideshow */}
				{slideshowPictures &&
					<Slideshow
						i={slideshowIndex}
						isOpen={slideshowIsOpen}
						onClose={closeSlideshow}>
						{slideshowPictures}
					</Slideshow>
				}

				<div className="webpage">
					<Header/>

					<div className="webpage__content">
						{ children }
					</div>

					<Footer/>
				</div>
			</div>
		)
	}
}

function getHTMLLocaleFromLanguage(language) {
	switch (language) {
		case 'ru':
			return 'ru_RU'
		case 'en':
			return 'en_US'
		default:
			throw new Error(`Unsupported language: ${language}`)
	}
}