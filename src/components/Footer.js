import React from 'react'
import { connect } from 'react-redux'
// import { Link } from 'react-website'
import classNames from 'classnames'

import ApplicationMenu from './ApplicationMenu'

import getMessages from '../messages'
import { getChan } from '../chan'
import { isContentSectionsContent, isRegularContent } from '../utility/routes'

import PostBlock from 'webapp-frontend/src/components/PostBlock'

import './Footer.css'

@connect(({ app, found }) => ({
	locale: app.settings.locale,
  route: found.resolvedMatch
}))
export default class Footer extends React.Component {
	render() {
		const {
			route,
			locale
		} = this.props
		return (
			<footer className={classNames('footer', {
				'footer--center': isRegularContent(route)
			})}>
				<div className={classNames('content', {
					'text-content': isContentSectionsContent(route) || isRegularContent(route)
				})}>
					{getChan().links &&
						<nav>
							<ul className="footer__chan-links">
								{getChan().links.map((link, i) => (
									<li key={i} className="footer__chan-link-item">
										<a
											target="_blank"
											href={link.url}
											className="footer__chan-link">
											{link.text}
										</a>
									</li>
								))}
							</ul>
						</nav>
					}
					<div className="footer__copyright">
						{typeof getChan().copyright === 'string' &&
							<p>
								{getChan().copyright.replace('{0}', (new Date()).getFullYear())}
							</p>
						}
						{Array.isArray(getChan().copyright) &&
							<PostBlock>
								{getChan().copyright}
							</PostBlock>
						}
						<p className="footer__copyright-chanchan">
							{getMessages(locale).copyright.preChanchan}
							<a
								target="_blank"
								href="https://github.com/catamphetamine/chanchan">
								chanchan
							</a>
							{getMessages(locale).copyright.postChanchan}
							{getMessages(locale).copyright.preAuthor}
							<a
								target="_blank"
								href="https://github.com/catamphetamine">
								@catamphetamine
							</a>
							.
						</p>
					</div>
					<ApplicationMenu footer/>
				</div>
			</footer>
		)
	}
}

const COPYRIGHT_REPORT = {
	_html: getChan().copyrightReport
}