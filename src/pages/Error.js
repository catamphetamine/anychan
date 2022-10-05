import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ExternalLink from 'frontend-lib/components/ExternalLink.js'

import { getProvider } from '../provider.js'
import getMessages from '../messages/index.js'

import useMessages from '../hooks/useMessages.js'
import useRoute from '../hooks/useRoute.js'

import './Error.css'

export default function ErrorPage({
	status
}) {
	const messages = useMessages()
	const errorPageMessages = useMessages().errorPages[status]

	const { location } = useRoute()
	const offline = useSelector(state => state.app.offline)

	const custom = getProvider() && getProvider().errorPages && getProvider().errorPages[status]

	const LinkComponent = offline ? ExternalLink : Link

	return (
		<section className={classNames('ErrorPage', {
			'ErrorPage--showImage': custom && custom.images
		})}>
			<div className="Content Content--text">
				<h1 className="ErrorPage-title">
					{errorPageMessages.title}
				</h1>
				{errorPageMessages.description &&
					<p className="ErrorPage-description">
						{errorPageMessages.description}
					</p>
				}
				{custom && custom.images &&
					<img
						aria-hidden
						src={getRandomElement(custom.images)}
						className="ErrorPage-image"/>
				}
				{location.query.url &&
					<LinkComponent to={location.query.url} className="ErrorPage-requestedUrl">
						{messages.errorPages.requestedURL}
					</LinkComponent>
				}
			</div>
		</section>
	)
}

ErrorPage.propTypes = {
	// locale: PropTypes.string.isRequired,
	// location: PropTypes.object.isRequired,
	// offline: PropTypes.boolean,
	status: PropTypes.number.isRequired
}

ErrorPage.defaultProps = {
	status: 500
}

ErrorPage.meta = ({ settings }) => ({
	title: getMessages(settings.settings.locale).errorPages['500'].title
})

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)]
}