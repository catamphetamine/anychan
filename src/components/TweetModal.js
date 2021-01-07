import React, { useCallback, useEffect, useLayoutEffect, useState, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

import { Modal } from 'react-responsive-ui'
import { Button } from 'webapp-frontend/src/components/Button'
import renderTweet from 'social-components/commonjs/services/Twitter/renderTweet'
import openLinkInNewTab from 'webapp-frontend/src/utility/openLinkInNewTab'

import CloseIcon from 'webapp-frontend/assets/images/icons/close.svg'

import { hideTweet } from '../redux/twitter'

import getMessages from '../messages'

import './TweetModal.css'

export default function TweetModal() {
	const tweetContent = useRef()
	const { locale } = useSelector(_ => _.settings.settings)
	const { darkMode } = useSelector(_ => _.app)
	const { tweetId, tweetUrl } = useSelector(_ => _.twitter)
	const [showTweet, setShowTweet] = useState(tweetId !== undefined)
	const [isLoading, setLoading] = useState()
	const onLoad = useCallback((container) => {
		tweetContent.current = container
		setLoading(false)
	}, [])
	const onError = useCallback((error) => {
		console.error(error)
		setShowTweet(false)
		setLoading(false)
		openLinkInNewTab(tweetUrl)
	}, [tweetUrl])
	const dispatch = useDispatch()
	const onHideTweet = useCallback(() => {
		dispatch(hideTweet())
	}, [dispatch])
	useEffect(() => {
		if (tweetId) {
			setShowTweet(true)
			setLoading(true)
		} else {
			setShowTweet(false)
			setLoading(false)
		}
	}, [tweetId])
	return (
		<React.Fragment>
			{showTweet &&
				<Tweet
					tweetId={tweetId}
					darkMode={darkMode}
					locale={locale}
					onLoad={onLoad}
					onError={onError}/>
			}
			<Modal
				isOpen={showTweet && !isLoading}
				close={onHideTweet}
				className="TweetModal">
				<Modal.Content>
					<TweetContent>
						{tweetContent.current}
					</TweetContent>
					<Button
						title={getMessages(locale).actions.close}
						onClick={onHideTweet}
						className="TweetModal-close">
						<CloseIcon className="TweetModal-closeIcon"/>
					</Button>
				</Modal.Content>
			</Modal>
		</React.Fragment>
	)
}

function TweetContent ({ children }) {
	const container = useRef()
	useLayoutEffect(() => {
		container.current.appendChild(children)
		return () => {
			container.current.removeChild(children)
		}
	}, [])
	return <div ref={container}/>
}

TweetContent = React.memo(TweetContent)

TweetContent.propTypes = {
	// Doesn't use `instanceOf(Element)` because Element
	// is not defined in Node.js.
	children: PropTypes.any.isRequired
}

function Tweet ({ tweetId, darkMode, locale, onLoad, onError }) {
	useEffect(() => {
		const wrapper = document.createElement('div')
		// If container is `display: none` then Twitter API won't render it.
		// Things like `position: absolute`, `position: fixed`, `max-width: 0`,
		// `max-height: 0` would also screw with the tweet rendering:
		// it's height would "jump" during the initial render.
		// `visibility: none` doesn't seem to mess with the rendering process.
		wrapper.style.visibility = 'none'
		document.body.appendChild(wrapper)
		renderTweet(tweetId, wrapper, { darkMode, locale }).then(
			(element) => onLoad(element),
			onError
		)
		return () => document.body.removeChild(wrapper)
	}, [])
	return null
}

Tweet.propTypes = {
	tweetId: PropTypes.string,
	darkMode: PropTypes.bool,
	locale: PropTypes.string,
	onLoad: PropTypes.func.isRequired,
	onError: PropTypes.func.isRequired
}