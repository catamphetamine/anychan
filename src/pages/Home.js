import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import PostBlock from 'webapp-frontend/src/components/PostBlock'

import ChanLogo, { hasLogo } from '../components/ChanLogo'

import { getChan, getChanDomain } from '../chan'
import getMessages from '../messages'
import { showSidebar, setSidebarMode } from '../redux/app'

import './Home.css'

@connect(({ app }) => ({
	locale: app.settings.locale
}), dispatch => ({ dispatch }))
export default class Home_ extends React.Component {
	render() {
		return <Home {...this.props}/>
	}
}

function Home({
	locale,
	dispatch
}) {
	const {
		title,
		subtitle,
		description,
		announcement,
		links
	} = getChan()
	const onShowBoardsList = useCallback(() => {
		dispatch(showSidebar(true))
		dispatch(setSidebarMode('boards'))
	}, [dispatch])
	return (
		<section className="home-page">
			<div className="content text-content">
				<div className="home-page__brand">
					{hasLogo() &&
						<a
							target="_blank"
							href={`https://${getChanDomain()}`}
							className="home-page__logo-link">
							<ChanLogo className="home-page__logo"/>
						</a>
					}
					<div className="home-page__title">
						<a
							target="_blank"
							href={`https://${getChanDomain()}`}>
							{title}
						</a>
						<div className="home-page__subtitle">
							{subtitle}
						</div>
					</div>
				</div>

				{description &&
					<div className="home-page__description">
						<PostBlock>
							{description}
						</PostBlock>
					</div>
				}

				{announcement &&
					<div className="home-page__announcement">
						<PostBlock>
							{announcement}
						</PostBlock>
					</div>
				}

				<p className="home-page__show-boards-list">
					<button
						type="button"
						onClick={onShowBoardsList}
						className="rrui__button-reset">
						{getMessages(locale).boards.showBoardsList}
					</button>
				</p>
			</div>
		</section>
	)
}

Home.propTypes = {
	locale: PropTypes.string.isRequired,
	dispatch: PropTypes.func.isRequired
}