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
import Sidebar from '../components/Sidebar'
import Snackbar from 'webapp-frontend/src/components/Snackbar'
import Slideshow from 'webapp-frontend/src/components/Slideshow'

// `react-time-ago` languages.
import { setDefaultLocale } from 'webapp-frontend/src/components/TimeAgo'
import 'webapp-frontend/src/components/TimeAgo.en'
import 'webapp-frontend/src/components/TimeAgo.ru'

import { closeSlideshow } from 'webapp-frontend/src/redux/slideshow'

import { getBoards } from '../redux/chan'
import { getSettings } from '../redux/account'

import { applySettings } from '../utility/settings'

import './Application.css'

@meta((state) => ({
	locale: getHTMLLocaleFromLanguage(state.account.settings.locale)
}))
@connect(({ slideshow, found }) => ({
	slideshowIndex: slideshow.index,
	slideshowIsOpen: slideshow.isOpen,
	slideshowPictures: slideshow.pictures,
  location: found.resolvedMatch.location
}), {
	closeSlideshow
})
@preload(async ({ dispatch, getState }) => {
	await dispatch(getSettings())
	applySettings(getState().account.settings)
	await dispatch(getBoards())
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
			location,
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

				<Sidebar show={location.pathname === '/'}/>

				<Header/>

				<div className="webpage">
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