import React from 'react'
import { connect } from 'react-redux'

import PostBlock from 'webapp-frontend/src/components/PostBlock'

import { getChan } from '../chan'
import getMessages from '../messages'
import { showSidebar } from '../redux/app'

import './Home.css'

@connect(({ app }) => ({
	locale: app.settings.locale
}), {
	showSidebar
})
export default class Home extends React.Component {
	render() {
		const {
			locale,
			showSidebar
		} = this.props

		const {
			color,
			website,
			logo: Logo,
			title,
			subtitle,
			description,
			announcement,
			links
		} = getChan()

		return (
			<section className="home-page">
				<div className="content text-content">
					<div className="home-page__brand">
						{Logo &&
							<a
								target="_blank"
								href={website}>
								{typeof Logo === 'string' &&
									<img src={Logo} className="home-page__logo"/>
								}
								{typeof Logo === 'function' &&
									<Logo className="home-page__logo"/>
								}
							</a>
						}
						<div className="home-page__title">
							<a
								target="_blank"
								href={website}
								style={{ color }}>
								{title}
							</a>
							<div className="home-page__subtitle">
								{subtitle}
							</div>
						</div>
					</div>

					{description &&
						<p className="home-page__description">
							{description}
						</p>
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
							onClick={showSidebar}
							className="rrui__button-reset">
							{getMessages(locale).showBoardsList}
						</button>
					</p>
				</div>
			</section>
		)
	}
}