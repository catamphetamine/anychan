import React, { useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
// import { Loading } from 'react-pages'
import classNames from 'classnames'

// Not importing `react-time-ago/Tooltip.css` because
// it's already loaded as part of `react-responsive-ui/style.css`.
// import 'react-time-ago/Tooltip.css'

import 'react-pages/components/Loading.css'
// Not importing `LoadingIndicator.css` because
// it's already loaded as part of `react-responsive-ui/style.css`.
// import 'react-pages/components/LoadingIndicator.css'

import Announcement, { announcementPropType } from 'webapp-frontend/src/components/Announcement'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar/Sidebar'
import SideNavMenuButton from '../components/SideNavMenuButton'
import BackButton from '../components/BackButton'
import Slideshow from '../components/Slideshow'
import Loading from '../components/LoadingIndicator'
import DeviceInfo from 'webapp-frontend/src/components/DeviceInfo'
import Snackbar from 'webapp-frontend/src/components/Snackbar'
import { loadYouTubeVideoPlayerApi } from 'webapp-frontend/src/components/YouTubeVideo'

// `react-time-ago` languages.
// import { setDefaultLocale } from 'webapp-frontend/src/components/TimeAgo'
import 'webapp-frontend/src/components/TimeAgo.de'
import 'webapp-frontend/src/components/TimeAgo.en'
import 'webapp-frontend/src/components/TimeAgo.ru'

import '@formatjs/intl-pluralrules/polyfill'
import '@formatjs/intl-pluralrules/locale-data/de'
import '@formatjs/intl-pluralrules/locale-data/en'
import '@formatjs/intl-pluralrules/locale-data/ru'

import OkCancelDialog from 'webapp-frontend/src/components/OkCancelDialog'
import { areCookiesAccepted, acceptCookies, addLearnMoreLink } from 'webapp-frontend/src/utility/cookiePolicy'
import TweetModal from '../components/TweetModal'

import { getBoards } from '../redux/chan'
import { getSettings } from '../redux/settings'
import { setCookiesAccepted, setOfflineMode } from '../redux/app'
import { getFavoriteBoards } from '../redux/favoriteBoards'
import { getTrackedThreads } from '../redux/threadTracker'
import { showAnnouncement, hideAnnouncement } from '../redux/announcement'

import getMessages from '../messages'
import UserData from '../UserData/UserData'
import onUserDataChange from '../UserData/onUserDataChange'
import {
	isContentSectionsContent,
	isThreadLocation,
	isBoardLocation,
	isBoardsLocation
} from '../utility/routes'
import { pollAnnouncement } from '../utility/announcement'
import getBasePath from '../utility/getBasePath'
import onSettingsChange from '../utility/onSettingsChange'
import UserSettings from '../utility/UserSettings'
import { dispatchDelayedActions } from '../utility/dispatch'
import configuration from '../configuration'

import './Application.css'

export default function App({
	children
}) {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const theme = useSelector(({ settings }) => settings.settings.theme)
	const cookiesAccepted = useSelector(({ app }) => app.cookiesAccepted)
	const sidebarMode = useSelector(({ app }) => app.sidebarMode)
	const offline = useSelector(({ app }) => app.offline)
	const route = useSelector(({ found }) => found.resolvedMatch)
  const location = useSelector(({ found }) => found.resolvedMatch.location)
  const announcement = useSelector(({ announcement }) => announcement.announcement)
	const dispatch = useDispatch()

	// UserData/UserSettings listeners.
	useEffect(() => {
		function updateUserData(key) {
			onUserDataChange(key, dispatch)
		}
		function updateUserSettings() {
			onSettingsChange(dispatch)
		}
		// Listens for changes to `localStorage`.
		// https://developer.mozilla.org/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API#Responding_to_storage_changes_with_the_StorageEvent
		// https://developer.mozilla.org/docs/Web/API/StorageEvent
		function localStorageListener(event) {
			if (!event.key) {
				updateUserSettings()
				updateUserData(event.key)
			} else {
				if (UserSettings.matchKey(event.key)) {
					updateUserSettings()
				}
				if (UserData.matchKey(event.key)) {
					updateUserData(event.key)
				}
			}
		}
		window.addEventListener('storage', localStorageListener)
		// `localStorage` might have changed before this listener has been added
		// therefore emulate a "change" event to apply any possible changes.
		return () => {
			window.removeEventListener('storage', localStorageListener)
		}
	}, [])

	useEffect(() => {
		// Load YouTube video player API.
		loadYouTubeVideoPlayerApi()
	}, [])

	useEffect(() => {
		setBodyBackground(route)
	}, [route])

	const onHideAnnouncement = useCallback(() => {
		dispatch(hideAnnouncement())
	}, [dispatch])

	const onAcceptCookies = useCallback(() => {
		acceptCookies()
		dispatch(setCookiesAccepted())
	}, [dispatch])

	const messages = getMessages(locale)

	return (
		<div className={classNames(`theme--${theme}`)}>
			{/* Page loading indicator */}
			<Loading/>

			{/* Pop-up messages */}
			<Snackbar/>

			{/* Detects touch capability and screen size. */}
			<DeviceInfo/>

			{/* Picture/Video Slideshow */}
			<Slideshow/>

			<div className={classNames('Webpage', {
				'Webpage--offline': offline,
				'Webpage--contentSections': isContentSectionsContent(route),
				'Webpage--boards': isBoardsLocation(route),
				'Webpage--board': isBoardLocation(route),
				'Webpage--thread': isThreadLocation(route),
				'Webpage--wideSidebar': sidebarMode !== 'boards'
			})}>
				{/*<Header/>*/}
				<SideNavMenuButton/>
				<div className="Webpage-paddingLeft">
					<BackButton/>
				</div>
				<div className="Webpage-contentContainer">
					{/* `<main/>` is focusable for keyboard navigation: page up, page down. */}
					<main
						tabIndex={-1}
						className="Webpage-content">
						{!cookiesAccepted &&
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
						{announcement &&
							<Announcement
								announcement={announcement}
								onClose={onHideAnnouncement}
								closeLabel={messages.actions.close}/>
						}
						{children}
					</main>
					<Footer/>
				</div>
				<div className="Webpage-paddingRight"/>
				<Sidebar/>
			</div>

			<OkCancelDialog
				okLabel={messages.actions.ok}
				cancelLabel={messages.actions.cancel}
				yesLabel={messages.actions.yes}
				noLabel={messages.actions.no}/>

			<TweetModal/>
		</div>
	)
}

App.propTypes = {
	// locale: PropTypes.string.isRequired,
	// theme: PropTypes.string.isRequired,
	// route: PropTypes.object.isRequired,
	// announcement: announcementPropType,
	// cookiesAccepted: PropTypes.bool.isRequired,
	// offline: PropTypes.bool,
	// dispatch: PropTypes.func.isRequired,
	children: PropTypes.node.isRequired
}

App.load = {
	load: async ({ dispatch, getState, location }) => {
		// Dispatch delayed actions.
		// For example, `dispatch(autoDarkMode())`.
		dispatchDelayedActions(dispatch)
		// Fill in user's preferences.
		dispatch(getSettings())
		dispatch(getFavoriteBoards())
		dispatch(getTrackedThreads())
		// Detect offline mode.
		if (location.query.offline) {
			return dispatch(setOfflineMode(true))
		}
		// Get the list of boards.
		try {
			await dispatch(getBoards())
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
				// (the app assumes the list of boards is available).
				// (maybe javascript won't even execute this line,
				//  because it's after a `window.location` redirect,
				//  or maybe it will, so just in case).
				await new Promise(resolve => {})
			} else {
				throw error
			}
		}
		// Show announcements.
		if (process.env.NODE_ENV === 'production' && configuration.announcementUrl) {
			pollAnnouncement(
				configuration.announcementUrl,
				announcement => dispatch(showAnnouncement(announcement)),
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
	// if (isContentSectionsContent(route) && !isThreadLocation(route)) {
	if (isContentSectionsContent(route)) {
		document.body.classList.add('document--background')
	} else {
		document.body.classList.remove('document--background')
	}
}