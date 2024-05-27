import type { PageLoadFunction, UserSettings, DataSource, UserData, UserSettingsJson } from '@/types'
import type { Dispatch } from 'redux'
import type { Route } from 'react-pages'

import React, { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch } from 'react-redux'
import classNames from 'classnames'

// import { useBeforeRenderNewPage, useAfterRenderedNewPage } from 'react-pages'

import Announcement, { announcementPropType } from 'frontend-lib/components/Announcement.js'

import Background from '../components/Background.js'
import Footer from '../components/Footer.js'
import SidebarLeft from '../components/SidebarLeft/SidebarLeft.js'
import SidebarRight from '../components/SidebarRight/SidebarRight.js'
import SideNavMenuButtons from '../components/SideNavMenuButtons.js'
import BackButton from '../components/BackButton.js'
import Markup from '../components/Markup.js'
import Slideshow from '../components/Slideshow.js'
import PageLoadingIndicator from '../components/PageLoadingIndicator.js'
import CaptchaModal from '../components/Captcha/CaptchaModal.js'
import ReportCommentModal from '../components/Report/ReportCommentModal.js'
import { CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH } from '../components/SidebarSections/ChannelThreadsSidebarSectionThread.js'
import useDeviceInfo from 'social-components-react/hooks/useDeviceInfo.js'
import Snackbar from 'frontend-lib/components/Snackbar.js'
import { loadYouTubeVideoPlayerApi } from 'social-components-react/components/Video.YouTube.js'

import useApplicationIcon from '../hooks/useApplicationIcon.js'
import { useSelector } from '@/hooks'

import onApplicationStarted from '../utility/onApplicationStarted.js'
import onBeforeNavigate from '../utility/onBeforeNavigate.js'
import onNavigate from '../utility/onNavigate.js'

import useOnWindowResize from 'frontend-lib/hooks/useOnWindowResize.js'
import OkCancelModal from 'frontend-lib/components/OkCancelModal.js'
import { areCookiesAccepted, acceptCookies, addLearnMoreLink } from 'frontend-lib/utility/cookiePolicy.js'
import TweetModal from '../components/TweetModal.js'

import { setCookiesAccepted } from '../redux/app.js'
import { markAnnouncementAsRead } from '../redux/announcement.js'
import { setShowCaptchaModal } from '../redux/captcha.js'

import useMessages from '../hooks/useMessages.js'
import useRoute from '../hooks/useRoute.js'
import useTheme from '../hooks/useTheme.js'
import useSetting from '../hooks/useSetting.js'
import { usePageStateSelectorOutsideOfPage } from '@/hooks'

import isContentSectionsPage from '../utility/routes/isContentSectionsPage.js'
import isThreadPage from '../utility/routes/isThreadPage.js'
import isChannelPage from '../utility/routes/isChannelPage.js'
import isChannelsPage from '../utility/routes/isChannelsPage.js'

import getApplicationMeta from './Application.meta.js'
import loadApplication from './Application.load.js'

import { markAnnouncementAsRead as _markAnnouncementAsRead } from '../utility/announcement.js'

import getConfiguration from '../getConfiguration.js'

import { MeasureContext } from '../hooks/useMeasure.js'
import { MultiDataSourceContext } from '../hooks/useMultiDataSource.js'
import { OriginalDomainContext } from '../hooks/useOriginalDomain.js'
import useDataSource, { DataSourceContext } from '../hooks/useDataSource.js'
import { DataSourceAliasContext } from '../hooks/useDataSourceAlias.js'
import useSettings, { SettingsContext } from '../hooks/useSettings.js'
import useUserData, { UserDataContext } from '../hooks/useUserData.js'
import useUserDataForUserDataCleaner, { UserDataForUserDataCleanerContext } from '../hooks/useUserDataForUserDataCleaner.js'

import './Application.css'
import './MainContentWithSidebarLayout.css'

// Not importing `react-time-ago/Tooltip.css` because
// it's already loaded as part of `react-responsive-ui/style.css`.
// import 'react-time-ago/Tooltip.css'

import '../components/PageLoading.css'

// Turn this flag to `true` to debug `virtual-scroller`.
//
// There might be several `<VirtualScroller/>`s on a page —
// for example, threads list in the left sidebar and then
// threads list on a channel page — so comment out all other
// `<VirtualScroller/>`s when debugging one of them.
//
// window.VirtualScrollerDebug = true

export default function Application({
	// All these properties are the ones that're returned from `Application.load.js` function.
	// They're passed to that function in the form of a `context` parameter.
	// The `context` parameter is created by `getLoadContext()` function in `render.js`.
	userData,
	userDataForUserDataCleaner,
	userSettings,
	dataSource,
	dataSourceAlias,
	multiDataSource,
	originalDomain,
	// `children` property is passed by `react-pages`.
	children
}: ApplicationProps) {
	return (
		<MultiDataSourceContext.Provider value={multiDataSource}>
			<OriginalDomainContext.Provider value={originalDomain}>
				<DataSourceAliasContext.Provider value={dataSourceAlias}>
					<DataSourceContext.Provider value={dataSource}>
						<UserDataContext.Provider value={userData}>
							<UserDataForUserDataCleanerContext.Provider value={userDataForUserDataCleaner}>
								<SettingsContext.Provider value={userSettings}>
									<App>
										{children}
									</App>
								</SettingsContext.Provider>
							</UserDataForUserDataCleanerContext.Provider>
						</UserDataContext.Provider>
					</DataSourceContext.Provider>
				</DataSourceAliasContext.Provider>
			</OriginalDomainContext.Provider>
		</MultiDataSourceContext.Provider>
	)
}

Application.propTypes = {
	children: PropTypes.node
}

interface ApplicationProps {
	userData: UserData,
	userDataForUserDataCleaner: UserData,
	userSettings: UserSettings,
	dataSource: DataSource,
	dataSourceAlias?: string,
	multiDataSource?: boolean,
	originalDomain?: string,
	// `children` property is passed by `react-pages`.
	children: ReactNode
}

const load: PageLoadFunction = async ({
	dispatch,
	useSelector,
	location,
	context
}) => {
	const useSetting_ = (getter: (settings: UserSettingsJson) => any) => useSetting(getter, { useSelector })

	const locale = useSetting_(settings => settings.locale)

	return await loadApplication({
		dispatch,
		location,
		userData: context.userData,
		userDataForUserDataCleaner: context.userDataForUserDataCleaner,
		userSettings: context.userSettings,
		dataSource: context.dataSource,
		dataSourceAlias: context.dataSourceAlias,
		multiDataSource: context.multiDataSource,
		originalDomain: context.originalDomain,
		locale
	})
}

Application.load = load

Application.meta = getApplicationMeta

function App({
	children
}: {
	children: ReactNode
}) {
	const dispatch = useDispatch()
	const messages = useMessages()

	const userData = useUserData()
	const userDataForUserDataCleaner = useUserDataForUserDataCleaner()
	const userSettings = useSettings()
	const dataSource = useDataSource()

	const [initialized, setInitialized] = useState<boolean>()

	const theme = useTheme()

	const cookiesAccepted = useSelector(state => state.app.cookiesAccepted)
	const offline = useSelector(state => state.app.offline)

	const captcha = useSelector(state => state.captcha.captcha)
	const captchaSubmitId = useSelector(state => state.captcha.captchaSubmitId)
	const showCaptchaModal = useSelector(state => state.captcha.showCaptchaModal)

	const hideCaptchaModal = useCallback(() => {
		dispatch(setShowCaptchaModal(false))
	}, [])

	const route = useRoute()

  const announcement = useSelector(state => state.announcement.announcement)
  const isLoadingTweet = useSelector(state => state.twitter.isLoading)

  const channelLayout = usePageStateSelectorOutsideOfPage('channelPage', state => state.channelPage.channelLayout)

  const backButtonAboveContent = useRef()

	// Detects touch capability and screen size.
	useDeviceInfo()

	useEffect(() => {
		// Load YouTube video player API.
		loadYouTubeVideoPlayerApi()

		const onApplicationStopped = onApplicationStarted({
			dispatch,
			userData,
			userDataForUserDataCleaner,
			userSettings,
			dataSource,
			setInitialized
		})

		return onApplicationStopped
	}, [])

	useEffect(() => {
		setBodyBackground(route)

		// Define `--ChannelThreadsSidebarSectionThreadThumbnail-width` CSS variable.
		document.documentElement.style.setProperty('--ChannelThreadsSidebarSectionThreadThumbnail-width', CHANNEL_THREADS_SIDEBAR_SECTION_THREAD_THUMBNAIL_WIDTH + 'px')
	}, [route])

	const paddingLeft = useRef<HTMLDivElement>()
	const paddingRight = useRef<HTMLDivElement>()
	const sidebarLeft = useRef<HTMLDivElement>()

	const measure = useCallback(() => {
		// These CSS variables can be used to expand an element on a page
		// to the full width of the page minus sidebar width.
		// For example, a "branding" top banner (like on Twitter or Facebook).
		document.documentElement.style.setProperty('--Webpage-paddingLeft-width', paddingLeft.current.getBoundingClientRect().width + 'px')
		document.documentElement.style.setProperty('--Webpage-paddingRight-width', paddingRight.current.getBoundingClientRect().width + 'px')

		/* `--PostThumbnail-maxWidth` CSS variable is updated via javascript on a thread page. */
		/* That change does not trigger a re-run of this hook because there's no window resize event. */
		/* Because of that, `--SidebarLeft-width` CSS variable is also updated on a thread page when
		   `--PostThumbnail-maxWidth` CSS variable is updated. */
		document.documentElement.style.setProperty('--SidebarLeft-width', sidebarLeft.current.getBoundingClientRect().width + 'px')

		/* Measure scrollbar width. */
		/* https://destroytoday.com/blog/100vw-and-the-horizontal-overflow-you-probably-didnt-know-about */
		document.documentElement.style.setProperty('--Scrollbar-width', (window.innerWidth - document.body.clientWidth) + 'px')
	}, [])

	useOnWindowResize(measure, { alsoAfterMount: true })

	const onHideAnnouncement = useCallback(() => {
		_markAnnouncementAsRead({ userData })
		dispatch(markAnnouncementAsRead())
	}, [dispatch, userData])

	const onAcceptCookies = useCallback(() => {
		acceptCookies()
		dispatch(setCookiesAccepted(true))
	}, [dispatch])

	const isCommentTextContentPage = isChannelPage(route) || isThreadPage(route)
	// const isLeftSidebarShown = isChannelPage(route) || isThreadPage(route)
	const isLeftSidebarIncluded = true

	/* Changes the application icon when there're any notifications. */
	useApplicationIcon()

	return (
		<MeasureContext.Provider value={measure}>
			<div className={classNames(`theme--${theme}`)}>
				{/* Gradient/pattern background */}
				<Background/>

				{/* Page loading indicator */}
				<PageLoadingIndicator show={isLoadingTweet || !initialized}/>

				{/* Pop-up messages */}
				<Snackbar placement="bottom"/>

				{/* Picture/Video Slideshow */}
				<Slideshow/>

				<div className={classNames('Webpage', {
					'Webpage--offline': offline,
					'Webpage--contentSections': isContentSectionsPage(route),
					// 'Webpage--channels': isChannelsPage(route),
					'Webpage--channel': isChannelPage(route),
					'Webpage--channel--threadsTiles': isChannelPage(route) && channelLayout === 'threadsTiles',
					'Webpage--thread': isThreadPage(route),
					'Webpage--commentTextContent': isCommentTextContentPage,
					'Webpage--withLeftSidebar': isLeftSidebarIncluded,
					// 'Webpage--hideLeftSidebar': !isLeftSidebarShown,
					'Webpage--centerCommentTextContent': isCommentTextContentPage && !isLeftSidebarIncluded,
					'Webpage--centerPageContent': !isCommentTextContentPage && !isLeftSidebarIncluded
					// 'Webpage--wideSidebar': sidebarMode !== 'channels'
				})}>
					{/*<Header/>*/}

					<SideNavMenuButtons/>

					<SidebarLeft ref={sidebarLeft}/>

					<div
						ref={paddingLeft}
						className="Webpage-paddingLeft">
						<BackButton placement="paddingLeft"/>
					</div>

					<div className="Webpage-contentContainer">
						<BackButton
							placement="content"
							syncWithButton={backButtonAboveContent}
						/>

						<BackButton
							ref={backButtonAboveContent}
							placement="aboveContent"
						/>

						{(getConfiguration().headerMarkupContent || getConfiguration().headerMarkupHtml) &&
							<Markup
								id="headerMarkup"
								content={getConfiguration().headerMarkupContent}
								markup={getConfiguration().headerMarkupHtml}
							/>
						}

						{/* `<main/>` is focusable for keyboard navigation: page up, page down. */}
						<main
							tabIndex={-1}
							className="Webpage-content">
							{initialized && !cookiesAccepted &&
								<Announcement
									onClick={onAcceptCookies}
									buttonLabel={messages.actions.accept}>
									{getConfiguration().cookiePolicyUrl ?
										addLearnMoreLink(
											messages.cookies.notice,
											messages.actions.learnMore,
											getConfiguration().cookiePolicyUrl
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
						className="Webpage-paddingRight"
					/>

					<SidebarRight/>

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

				<CaptchaModal
					captcha={captcha}
					captchaSubmitId={captchaSubmitId}
					isOpen={showCaptchaModal}
					close={hideCaptchaModal}
				/>

				<ReportCommentModal/>

				<TweetModal/>
			</div>
		</MeasureContext.Provider>
	)
}

App.propTypes = {
	children: PropTypes.node
}

function setBodyBackground(route: Route) {
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
window._onBeforeNavigate = ({ dispatch }: { dispatch: Dispatch }) => {
	onBeforeNavigate({ dispatch })
}

// This is hot-reloadable.
window._onNavigate = ({ dispatch }: { dispatch: Dispatch }) => {
	onNavigate({ dispatch })
}