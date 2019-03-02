import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, Link } from 'react-website'
import classNames from 'classnames'

import { getChan } from '../chan'
import getMessages from '../messages'

import './Error.css'
import './NotFound.css'

@meta(({ app }) => ({
	title: getMessages(app.settings.locale).errorPages['404'].title
}))
@connect(({ app, found }) => ({
	locale: app.settings.locale,
	location: found.resolvedMatch.location
}))
export default class NotFound extends React.Component {
	static propTypes = {
		locale: PropTypes.string.isRequired,
		location: PropTypes.object.isRequired
	}

	render() {
		const {
			locale,
			location
		} = this.props

		const custom = getChan().errorPages && getChan().errorPages['404']

		return (
			<section className={classNames('error-page', {
				'error-page--image': custom && custom.images
			})}>
				<div className="content text-content">
					<h1 className="error-page__title">
						{getMessages(locale).errorPages['404'].title}
					</h1>
					{custom && custom.images &&
						<img
							aria-hidden
							src={getRandomElement(custom.images)}
							className="error-page__image"/>
					}
					{location.query.url &&
						<Link to={location.query.url} className="error-page__requested-url">
							{getMessages(locale).errorPages.requestedURL}
						</Link>
					}
				</div>
			</section>
		)
	}
}

function getRandomElement(array) {
	return array[Math.floor(Math.random() * array.length)]
}