import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'

import PostBlock from 'webapp-frontend/src/components/PostBlock'
import { Button } from 'webapp-frontend/src/components/Button'

import ChanLogo, { hasLogo } from '../components/ChanLogo'

import { getChan, getChanDomain } from '../chan'
import getMessages from '../messages'
import { showSidebar, setSidebarMode } from '../redux/app'

import './Home.css'

export default function Home() {
	const {
		title,
		subtitle,
		description,
		announcement,
		links
	} = getChan()
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const dispatch = useDispatch()
	const onShowBoardsList = useCallback(() => {
		dispatch(showSidebar(true))
		dispatch(setSidebarMode('boards'))
	}, [dispatch])
	return (
		<section className="HomePage">
			<div className="Content Content--text">
				<div className="HomePage-brand">
					{hasLogo() &&
						<a
							target="_blank"
							href={`https://${getChanDomain()}`}
							className="HomePage-logoLink">
							<ChanLogo className="HomePage-logo"/>
						</a>
					}
					<div className="HomePage-title">
						<a
							target="_blank"
							href={`https://${getChanDomain()}`}>
							{title}
						</a>
						<div className="HomePage-subtitle">
							{subtitle}
						</div>
					</div>
				</div>

				{description &&
					<div className="HomePage-description">
						<PostBlock>
							{description}
						</PostBlock>
					</div>
				}

				{announcement &&
					<div className="HomePage-announcement">
						<PostBlock>
							{announcement}
						</PostBlock>
					</div>
				}

				<p className="HomePage-showBoardsList">
					<Button
						onClick={onShowBoardsList}>
						{getMessages(locale).boards.showBoardsList}
					</Button>
				</p>
			</div>
		</section>
	)
}