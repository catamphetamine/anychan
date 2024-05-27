import type { ReactNode } from 'react'

import React, { useCallback, useEffect, useLayoutEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types'

// @ts-expect-error
import { Modal } from 'react-responsive-ui'

import Button from 'frontend-lib/components/Button.js'

import { renderTweet } from 'social-components/services/twitter'
import { openLinkInNewTab } from 'web-browser-input'

import useEffectSkipMount from 'frontend-lib/hooks/useEffectSkipMount.js'

import CloseIcon from 'frontend-lib/icons/close.svg'

import { hideTweet, setLoadingTweet } from '../redux/twitter.js'

import useMessages from '../hooks/useMessages.js'
import useLocale from '../hooks/useLocale.js'
import useSelector from '../hooks/useSelector.js'

import './TweetModal.css'

export default function TweetModal() {
	const tweetContent = useRef<HTMLElement>()

	const dispatch = useDispatch()
	const messages = useMessages()
	const locale = useLocale()

	const darkMode = useSelector(state => state.app.darkMode)
	const { tweetId, tweetUrl, isLoading } = useSelector(state => state.twitter)

	const [showTweet, setShowTweet] = useState(tweetId !== undefined)

	const onLoad = useCallback((container: HTMLElement) => {
		tweetContent.current = container
		dispatch(setLoadingTweet(false))
	}, [])

	const onError = useCallback((error: Error) => {
		console.error(error)
		setShowTweet(false)
		dispatch(setLoadingTweet(false))
		openLinkInNewTab(tweetUrl)
	}, [tweetUrl])

	const onHideTweet = useCallback(() => {
		dispatch(hideTweet())
	}, [dispatch])

	useEffectSkipMount(() => {
		if (tweetId) {
			setShowTweet(true)
			dispatch(setLoadingTweet(true))
		} else {
			setShowTweet(false)
			dispatch(setLoadingTweet(false))
		}
	}, [tweetId])

	useRenderTweet({
		canRender: showTweet,
		tweetId,
		darkMode,
		locale,
		onLoad,
		onError
	})

	return (
		<React.Fragment>
			<Modal
				isOpen={showTweet && !isLoading}
				close={onHideTweet}
				className="TweetModal">
				<Modal.Content>
					{tweetContent.current &&
						<TweetContentMemoized>
							{tweetContent.current}
						</TweetContentMemoized>
					}
					<Button
						title={messages.actions.close}
						onClick={onHideTweet}
						className="TweetModal-close">
						<CloseIcon className="TweetModal-closeIcon"/>
					</Button>
				</Modal.Content>
			</Modal>
		</React.Fragment>
	)
}

function TweetContent ({ children }: { children: HTMLElement }) {
	const container = useRef<HTMLDivElement>()

	useLayoutEffect(() => {
		container.current.appendChild(children)
		return () => {
			container.current.removeChild(children)
		}
	}, [])

	return <div ref={container}/>
}

TweetContent.propTypes = {
	// Doesn't use `instanceOf(Element)` because Element
	// is not defined in Node.js.
	children: PropTypes.any.isRequired
}

const TweetContentMemoized = React.memo(TweetContent)

function useRenderTweet({
	canRender,
	tweetId,
	darkMode,
	locale,
	onLoad,
	onError
}: {
	canRender: boolean,
	tweetId: string,
	darkMode?: boolean
	locale?: string,
	onLoad: (element: HTMLElement) => void,
	onError: (error: Error) => void
}) {
	const triggered = useRef(false)

	useEffect(() => {
		if (!canRender) {
			return
		}
		if (triggered.current) {
			return
		}
		triggered.current = true
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
		return () => {
			document.body.removeChild(wrapper)
		}
	}, [canRender])
}