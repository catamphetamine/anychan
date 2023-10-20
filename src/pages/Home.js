import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import { Content } from 'social-components-react/components/PostContent.js'
import Button from 'frontend-lib/components/Button.js'

import DataSourceLogo, { hasLogo } from '../components/DataSourceLogo.js'

import useMessages from '../hooks/useMessages.js'
import useDataSource from '../hooks/useDataSource.js'

import { setShowSidebar, setSidebarMode } from '../redux/app.js'

import './Home.css'

export default function Home() {
	const dataSource = useDataSource()

	const {
		title,
		subtitle,
		description,
		announcement,
		links
	} = dataSource

	const messages = useMessages()
	const dispatch = useDispatch()

	const onShowChannelsList = useCallback(() => {
		dispatch(setShowSidebar(true))
		dispatch(setSidebarMode('channel'))
	}, [dispatch])

	return (
		<section className="HomePage">
			<div className="Content Content--text">
				<div className="HomePage-brand">
					{hasLogo(dataSource) &&
						<a
							target="_blank"
							href={`https://${dataSource.domain}`}
							className="HomePage-logoLink">
							<DataSourceLogo className="HomePage-logo"/>
						</a>
					}
					<div>
						<a
							target="_blank"
							href={`https://${dataSource.domain}`}
							className="HomePage-title">
							{title}
						</a>
						{subtitle &&
							<div className="HomePage-subtitle">
								{subtitle}
							</div>
						}
					</div>
				</div>

				{description &&
					<div className="HomePage-description">
						<Content>
							{description}
						</Content>
					</div>
				}

				<p className="HomePage-showChannelsList">
					<Button
						onClick={onShowChannelsList}>
						{messages.boards.showChannelsList}
					</Button>
				</p>
			</div>
		</section>
	)
}