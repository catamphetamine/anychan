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

import Announcement, { announcementPropType } from '../components/Announcement'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import DeviceInfo from 'webapp-frontend/src/components/DeviceInfo'
import Snackbar from 'webapp-frontend/src/components/Snackbar'
import Slideshow from 'webapp-frontend/src/components/Slideshow'

// `react-time-ago` languages.
import { setDefaultLocale } from 'webapp-frontend/src/components/TimeAgo'
import 'webapp-frontend/src/components/TimeAgo.en'
import 'webapp-frontend/src/components/TimeAgo.ru'

import { closeSlideshow } from 'webapp-frontend/src/redux/slideshow'
import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'
import { areCookiesAccepted, acceptCookies, addLearnMoreLink } from 'webapp-frontend/src/utility/cookiePolicy'

import { getBoards } from '../redux/chan'
import { getSettings, setCookiesAccepted } from '../redux/app'
import { showAnnouncement, hideAnnouncement } from '../redux/announcement'

import getMessages from '../messages'
import { isContentSectionsContent, isRegularContent } from '../utility/routes'
import { pollAnnouncement } from '../utility/announcement'
import configuration from '../configuration'

import './Application.css'

@connect(({ app, slideshow, found, announcement }) => ({
	locale: app.settings.locale,
	theme: app.settings.theme,
	cookiesAccepted: app.cookiesAccepted,
	route: found.resolvedMatch,
	slideshowIndex: slideshow.index,
	slideshowIsOpen: slideshow.isOpen,
	slideshowPictures: slideshow.pictures,
	slideshowMode: slideshow.slideshowMode,
  location: found.resolvedMatch.location,
  announcement: announcement.announcement
}), {
	closeSlideshow,
	hideAnnouncement,
	setCookiesAccepted
})
@preload(async ({ dispatch, getState }) => {
	// Apply user's settings.
	await dispatch(getSettings())
	// Get the list of boards.
	await dispatch(getBoards())
	// Show announcements.
	if (process.env.NODE_ENV === 'production' && configuration.announcementUrl) {
		pollAnnouncement(
			configuration.announcementUrl,
			announcement => dispatch(showAnnouncement(announcement)),
			configuration.announcementPollInterval
		)
	}
}, {
	blocking: true
})
export default class App extends React.Component {
	static propTypes = {
		locale: PropTypes.string.isRequired,
		theme: PropTypes.string.isRequired,
		route: PropTypes.object.isRequired,
		announcement: announcementPropType,
		hideAnnouncement: PropTypes.func.isRequired,
		cookiesAccepted: PropTypes.bool.isRequired,
		setCookiesAccepted: PropTypes.func.isRequired,
		closeSlideshow: PropTypes.func.isRequired,
		children : PropTypes.node.isRequired
	}

	componentDidMount() {
		const { route } = this.props
		this.setBodyBackground(route)
	}

	componentDidUpdate(prevProps) {
		const { route } = this.props
		if (route !== prevProps.route) {
			this.setBodyBackground(route)
		}
	}

	setBodyBackground(route) {
		// Set or reset "body--content-sections" class
		// which changes `<body/>` background color
		// in order to show correct color when scrolling
		// past top/bottom of the page on touch devices.
		if (isContentSectionsContent(route)) {
			document.body.classList.add('body--content-sections')
		} else {
			document.body.classList.remove('body--content-sections')
		}
	}

	render() {
		const {
			announcement,
			locale,
			theme,
			route,
			slideshowIndex,
			slideshowIsOpen,
			slideshowPictures,
			slideshowMode,
			closeSlideshow,
			hideAnnouncement,
			cookiesAccepted,
			setCookiesAccepted,
			location,
			children
		} = this.props

		const messages = getMessages(locale)

		return (
			<div className={classNames(`theme--${theme}`)}>
				{/* Page loading indicator */}
				<Loading/>

				{/* Pop-up messages */}
				<Snackbar/>

				{/* Detects touch device. */}
				<DeviceInfo/>

				{/* Picture Slideshow */}
				{slideshowPictures &&
					<Slideshow
						i={slideshowIndex}
						isOpen={slideshowIsOpen}
						slideshowMode={slideshowMode}
						onClose={closeSlideshow}
						messages={messages.slideshow}>
						{slideshowPictures}
					</Slideshow>
				}

				<div className="webpage">
					<Header/>
					<Sidebar/>
					<div className={classNames('webpage__main', {
						'webpage__main--content-sections': isContentSectionsContent(route)
					})}>
						{/* `<main/>` is focusable for keyboard navigation: page up, page down. */}
						<main
							tabIndex={-1}
							className={classNames('webpage__content', {
								'webpage__content--regular': isRegularContent(route)
							})}>
							{!cookiesAccepted &&
								<Announcement
									onClick={() => {
										acceptCookies()
										setCookiesAccepted()
									}}
									buttonLabel={messages.actions.accept}>
									{configuration.cookiePolicyUrl ?
										addLearnMoreLink(
											messages.cookies.notice,
											messages.actions.learnMore,
											configuration.cookiePolicyUrl
										) :
										messages.cookies.notice
									}
								</Announcement>
							}
							{announcement &&
								<Announcement
									announcement={announcement}
									onClose={hideAnnouncement}
									closeLabel={messages.actions.close}/>
							}
							{children}
						</main>
						<Footer className="background-content"/>
					</div>
				</div>

				<OkCancelDialog
					okLabel={messages.actions.ok}
					cancelLabel={messages.actions.cancel}
					yesLabel={messages.actions.yes}
					noLabel={messages.actions.no}/>
			</div>
		)
	}
}
