import React from 'react'
import { connect } from 'react-redux'

import { PostBlock } from 'webapp-frontend/src/components/Post'

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
								<Logo className="home-page__logo"/>
							</a>
						}
						<div className="home-page__title">
							<a
								target="_blank"
								href={website}
								style={{ color }}
								className="home-page__title-text">
								{title}
							</a>
							{subtitle &&
								<div className="home-page__subtitle">
									{subtitle}
								</div>
							}
						</div>
					</div>

					<p className="home-page__description">
						{description}
					</p>

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