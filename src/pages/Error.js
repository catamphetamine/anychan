import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, Link } from 'react-website'
import classNames from 'classnames'

import ExternalLink from 'webapp-frontend/src/components/ExternalLink'

import { getChan } from '../chan'
import getMessages from '../messages'

import './Error.css'

@meta(({ settings }) => ({
	title: getMessages(settings.settings.locale).errorPages['500'].title
}))
@connect(({ settings, found, app }) => ({
	locale: settings.settings.locale,
	location: found.resolvedMatch.location,
	offline: app.offline
}))
export default class ErrorPage_ extends React.Component {
	render() {
		return <ErrorPage {...this.props}/>
	}
}

export function ErrorPage({
	locale,
	location,
	status,
	offline
}) {
	const custom = getChan().errorPages && getChan().errorPages[status]
	const messages = getMessages(locale).errorPages[status]
	const LinkComponent = offline ? ExternalLink : Link
	return (
		<section className={classNames('error-page', {
			'error-page--image': custom && custom.images
		})}>
			<div className="content text-content">
				<h1 className="error-page__title">
					{messages.title}
				</h1>
				{messages.description &&
					<p className="error-page__description">
						{messages.description}
					</p>
				}
				{custom && custom.images &&
					<img
						aria-hidden
						src={getRandomElement(custom.images)}
						className="error-page__image"/>
				}
				{location.query.url &&
					<LinkComponent to={location.query.url} className="error-page__requested-url">
						{getMessages(locale).errorPages.requestedURL}
					</LinkComponent>
				}
			</div>
		</section>
	)
}

ErrorPage.propTypes = {
	locale: PropTypes.string.isRequired,
	location: PropTypes.object.isRequired,
	status: PropTypes.number.isRequired,
	offline: PropTypes.boolean
}

ErrorPage.defaultProps = {
	status: 500
}

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)]
}