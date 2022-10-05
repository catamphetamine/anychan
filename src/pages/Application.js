import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
// import { Loading } from 'react-pages'
import classNames from 'classnames'

import Announcement, { announcementPropType } from 'frontend-lib/components/Announcement.js'

import Header from '../components/Header.js'
import Footer from '../components/Footer.js'
import Sidebar from '../components/Sidebar/Sidebar.js'
import SideNavMenuButtons from '../components/SideNavMenuButtons.js'
import BackButton from '../components/BackButton.js'
import Markup from '../components/Markup.js'
import Slideshow from '../components/Slideshow.js'
import Loading from '../components/LoadingIndicator.js'
import useDeviceInfo from 'social-components-react/hooks/useDeviceInfo.js'
import Snackbar from 'frontend-lib/components/Snackbar.js'
import { loadYouTubeVideoPlayerApi } from 'social-components-react/components/Video.YouTube.js'

import useApplicationIcon from '../hooks/useApplicationIcon.js'

import onApplicationStarted from '../utility/onApplicationStarted.js'
import onBeforeNavigate from '../utility/onBeforeNavigate.js'
import onNavigate from '../utility/onNavigate.js'

import useOnWindowResize from 'frontend-lib/hooks/useOnWindowResize.js'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'
import { areCookiesAccepted, acceptCookies, addLearnMoreLink } from 'frontend-lib/utility/cookiePolicy.js'
import TweetModal from '../components/TweetModal.js'

import { getChannels } from '../redux/data.js'
import { getSettings } from '../redux/settings.js'
import { setCookiesAccepted, setOfflineMode } from '../redux/app.js'
import { getFavoriteChannels } from '../redux/favoriteChannels.js'
import { getSubscribedThreads } from '../redux/subscribedThreads.js'
import { markAnnouncementAsRead } from '../redux/announcement.js'
import { setAnnouncement } from '../redux/announcement.js'

import useMessages from '../hooks/useMessages.js'
import useRoute from '../hooks/useRoute.js'

import isContentSectionsPage from '../utility/routes/isContentSectionsPage.js'
import isThreadPage from '../utility/routes/isThreadPage.js'
import isChannelPage from '../utility/routes/isChannelPage.js'
import isChannelsPage from '../utility/routes/isChannelsPage.js'

import getUserData from '../UserData.js'

import {
	startPollingAnnouncement,
	markAnnouncementAsRead as _markAnnouncementAsRead
} from '../utility/announcement.js'

import getBasePath, { addBasePath } from '../utility/getBasePath.js'
import { onDispatchReady } from '../utility/dispatch.js'
import configuration from '../configuration.js'

import './Application.css'
import './MainContentWithSidebarLayout.css'

// Not importing `react-time-ago/Tooltip.css` because
// it's already loaded as part of `react-responsive-ui/style.css`.
// import 'react-time-ago/Tooltip.css'

import '../components/PageLoading.css'
// Not importing `LoadingIndicator.css` because
// it's already loaded as part of `react-responsive-ui/style.css`.
// import 'react-pages/components/LoadingIndicator.css'

export default function App({
	children
}) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const [initialized, setInitialized] = useState()

	const theme = useSelector(state => state.settings.settings.theme)

	const cookiesAccepted = useSelector(state => state.app.cookiesAccepted)
	const offline = useSelector(state => state.app.offline)

	const route = useRoute()
  const { location } = route

  const announcement = useSelector(state => state.announcement.announcement)
  const isLoadingTweet = useSelector(state => state.twitter.isLoading)

	// Detects touch capability and screen size.
	useDeviceInfo()

	useEffect(() => {
		// Load YouTube video player API.
		loadYouTubeVideoPlayerApi()

		onApplicationStarted({ dispatch, setInitialized })
	}, [])

	useEffect(() => {
		setBodyBackground(route)
	}, [route])

	const paddingLeft = useRef()
	const paddingRight = useRef()
	useOnWindowResize(() => {
		// These CSS variables can be used to expand an element on a page
		// to the full width of the page minus sidebar width.
		// For example, a "branding" top banner (like on Twitter or Facebook).
		document.body.style.setProperty('--Webpage-paddingLeft-width', paddingLeft.current.getBoundingClientRect().width + 'px')
		document.body.style.setProperty('--Webpage-paddingRight-width', paddingRight.current.getBoundingClientRect().width + 'px')
	}, { alsoOnMount: true })

	const onHideAnnouncement = useCallback(() => {
		_markAnnouncementAsRead()
		dispatch(markAnnouncementAsRead())
	}, [dispatch])

	const onAcceptCookies = useCallback(() => {
		acceptCookies()
		dispatch(setCookiesAccepted())
	}, [dispatch])

	/* Changes the application icon when there're any notifications. */
	useApplicationIcon()

	return (
		<div className={classNames(`theme--${theme}`)}>
			{/* Page loading indicator */}
			<Loading show={isLoadingTweet || !initialized}/>

			{/* Pop-up messages */}
			<Snackbar/>

			{/* Picture/Video Slideshow */}
			<Slideshow/>

			<div className={classNames('Webpage', {
				'Webpage--offline': offline,
				'Webpage--contentSections': isContentSectionsPage(route),
				// 'Webpage--channels': isChannelsPage(route),
				'Webpage--channel': isChannelPage(route),
				'Webpage--thread': isThreadPage(route),
				// 'Webpage--wideSidebar': sidebarMode !== 'channels'
			})}>
				{/*<Header/>*/}

				<SideNavMenuButtons/>

				<div
					ref={paddingLeft}
					className="Webpage-paddingLeft">
					<BackButton/>
				</div>

				<div className="Webpage-contentContainer">
					{configuration.headerMarkup &&
						<Markup
							content={configuration.headerContent}
							markup={configuration.headerMarkup}
							fullWidth={configuration.headerMarkupFullWidth}
							className="Webpage-headerBanner"/>
					}

					{/* `<main/>` is focusable for keyboard navigation: page up, page down. */}
					<main
						tabIndex={-1}
						className="Webpage-content">
						{initialized && !cookiesAccepted &&
							<Announcement
								onClick={onAcceptCookies}
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

						{announcement && !announcement.read &&
							<Announcement
								announcement={announcement}
								onClose={onHideAnnouncement}
								closeLabel={messages.actions.close}
							/>
						}
						{children}
					</main>

					<Footer/>
				</div>

				<div
					ref={paddingRight}
					className="Webpage-paddingRight"/>

				<Sidebar/>

				{/*
				<FullWidthContent>
					...
				</FullWidthContent>
				*/}
			</div>

			<OkCancelModal
				okLabel={messages.actions.ok}
				cancelLabel={messages.actions.cancel}
				yesLabel={messages.actions.yes}
				noLabel={messages.actions.no}
			/>

			<TweetModal/>
		</div>
	)
}

App.propTypes = {
	// theme: PropTypes.string.isRequired,
	// route: PropTypes.object.isRequired,
	// announcement: announcementPropType,
	// cookiesAccepted: PropTypes.bool.isRequired,
	// offline: PropTypes.bool,
	// dispatch: PropTypes.func.isRequired,
	children: PropTypes.node
}

App.load = {
	load: async ({ dispatch, getState, location }) => {
		// Dispatch delayed actions.
		// For example, `dispatch(autoDarkMode())`.
		onDispatchReady(dispatch)
		// Fill in user's preferences.
		dispatch(getSettings())
		dispatch(getFavoriteChannels())
		dispatch(getSubscribedThreads())
		// Detect offline mode.
		if (location.query.offline) {
			return dispatch(setOfflineMode(true))
		}
		// Get the list of channels.
		try {
			await dispatch(getChannels())
		} catch (error) {
			let errorPageUrl
			// `503 Service Unavailable`
			// `502 Bad Gateway`
			// "Request has been terminated" error is thrown by a web browser
			// when it can't connect to the server (doesn't have a `status`).
			if (error.message.indexOf('Request has been terminated') === 0 || error.status === 503 || error.status === 502) {
				errorPageUrl = '/offline'
			} else if (error.status === 404) {
				errorPageUrl = '/not-found'
			} else {
				errorPageUrl = '/error'
			}
			if (errorPageUrl) {
				console.error(error)
				window.location = `${getBasePath()}${errorPageUrl}?offline=✓&url=${encodeURIComponent(getBasePath() + location.pathname + location.search + location.hash)}`
				// Don't render the page because it would throw.
				// (the app assumes the list of channels is available).
				// (maybe javascript won't even execute this line,
				//  because it's after a `window.location` redirect,
				//  or maybe it will, so just in case).
				await new Promise(resolve => {})
			} else {
				throw error
			}
		}
		// Show announcements.
		if (process.env.NODE_ENV === 'production') {
			startPollingAnnouncement(
				configuration.announcementUrl || addBasePath('/announcement.json'),
				announcement => dispatch(setAnnouncement(announcement)),
				configuration.announcementPollInterval
			)
		}
	},
	blocking: true
}

function setBodyBackground(route) {
	// Set or reset "document--background" class
	// which changes `<body/>` background color
	// in order to show correct color when scrolling
	// past top/bottom of the page on touch devices.
	// if (isContentSectionsPage(route) && !isThreadPage(route)) {
	if (isContentSectionsPage(route)) {
		document.body.classList.add('document--background')
	} else {
		document.body.classList.remove('document--background')
	}
}

// This is hot-reloadable.
window._onBeforeNavigate = ({ dispatch }) => {
	onBeforeNavigate({ dispatch })
}

// This is hot-reloadable.
window._onNavigate = ({ dispatch }) => {
	onNavigate({ dispatch })
}