import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { preload, Loading } from 'react-website'
import classNames from 'classnames'

// Not importing `react-time-ago/Tooltip.css` because
// it's already loaded as part of `react-responsive-ui/style.css`.
// import 'react-time-ago/Tooltip.css'

import 'react-website/components/Loading.css'
// Not importing `LoadingIndicator.css` because
// it's already loaded as part of `react-responsive-ui/style.css`.
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
import { getSettings } from '../redux/app'

import { applySettings } from '../utility/settings'
import { isContentSectionsContent } from '../utility/routes'

import './Application.css'

@connect(({ app, slideshow, found }) => ({
	theme: app.settings.theme,
	route: found.resolvedMatch,
	slideshowIndex: slideshow.index,
	slideshowIsOpen: slideshow.isOpen,
	slideshowPictures: slideshow.pictures,
  location: found.resolvedMatch.location
}), {
	closeSlideshow
})
@preload(async ({ dispatch, getState }) => {
	await dispatch(getSettings())
	applySettings(getState().app.settings)
	await dispatch(getBoards())
}, {
	blocking: true
})
export default class App extends React.Component {
	static propTypes = {
		theme: PropTypes.string.isRequired,
		route: PropTypes.object.isRequired,
		children : PropTypes.node.isRequired
	}

	render() {
		const {
			theme,
			route,
			slideshowIndex,
			slideshowIsOpen,
			slideshowPictures,
			closeSlideshow,
			location,
			children
		} = this.props

		return (
			<div className={classNames(`theme--${theme}`)}>
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
					<Sidebar/>
					<div className={classNames('webpage__main', {
						'webpage__main--content-sections': isContentSectionsContent(route)
					})}>
						{/* `<main/>` is focusable for keyboard navigation: page up, page down. */}
						<main className="webpage__content" tabIndex={-1}>
							{ children }
						</main>
						<Footer/>
						<Header/>
					</div>
				</div>
			</div>
		)
	}
}