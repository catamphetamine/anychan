import type { PageMetaFunction } from '@/types'

import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ExternalLink from 'frontend-lib/components/ExternalLink.js'

import Heading from '../components/Heading.js'

import useDataSource from '../hooks/useDataSource.js'
import useBackground from '../hooks/useBackground.js'

import { useSelector, useMessages, useRoute } from '@/hooks'

import './Error.css'

export default function ErrorPage({
	status = 500
}: ErrorPageProps) {
	const messages = useMessages()
	const errorPageMessages = useMessages().errorPages[status]

	const { location } = useRoute()
	const offline = useSelector(state => state.app.offline)

	const background = useBackground()
	const dataSource = useDataSource()

	const custom = dataSource && dataSource.errorPages && dataSource.errorPages[status]

	const LinkComponent = offline ? ExternalLink : Link

	return (
		<section className={classNames('ErrorPage', {
			'ErrorPage--showImage': custom && custom.images
		})}>
			<div className="Content Content--text">
				<Heading onBackground className="ErrorPage-title">
					{errorPageMessages.title}
				</Heading>
				{errorPageMessages.description &&
					<p className="ErrorPage-description">
						{errorPageMessages.description}
					</p>
				}
				{offline && dataSource && dataSource.id === '94chan' &&
					<p className="ErrorPage-description">
						<code className="ErrorPage-code">94chan.org</code> is known to not work with the default "demo" proxy due to its anti-DDoS protection system. But it does work with a proxy that is manually run at <code className="ErrorPage-code">localhost</code>.
					</p>
				}
				{offline && dataSource && dataSource.id === 'ptchan' &&
					<p className="ErrorPage-description">
						<code className="ErrorPage-code">ptchan.org</code> is <a href="https://gitgud.io/fatchan/haproxy-protection/-/issues/24" target="_blank">known</a> to not work with the default "demo" proxy due to its anti-DDoS protection system. But it would've been working otherwise.
					</p>
				}
				{custom && custom.images &&
					<img
						aria-hidden
						src={getRandomElement(custom.images)}
						className="ErrorPage-image"
					/>
				}
				{location.query.url &&
					<LinkComponent to={location.query.url} className={classNames('ErrorPage-requestedUrl', {
						'ErrorPage-requestedUrl--onBackground': background
					})}>
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
	status: PropTypes.number
}

interface ErrorPageProps {
	status?: number
}

const meta: PageMetaFunction = ({ useSelector }) => {
	const messages = useMessages({ useSelector })
	return {
		title: messages.errorPages['500'].title
	}
}

ErrorPage.meta = meta

function getRandomElement(array: any[]) {
	return array[Math.floor(Math.random() * array.length)]
}