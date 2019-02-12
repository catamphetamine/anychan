import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import ApplicationMenu from './ApplicationMenu'
import { isBoardLocation, isThreadLocation } from './Header'

import './Footer.css'

@connect(({ found }) => ({
  route: found.resolvedMatch
}))
export default class Footer extends React.Component {
	render() {
		const { route } = this.props
		return (
			<footer className="footer">
				<div className={classNames('content', {
					'content--posts': isBoardLocation(route) ||
						isThreadLocation(route) ||
						route.location.pathname === '/settings'
				})}>
					<div className="footer__copyright">
						<a
							target="_blank"
							href="https://github.com/catamphetamine/chanchan"
							className="footer__link">
							chanchan imageboard browser
						</a>
					</div>
					<ApplicationMenu footer/>
				</div>
			</footer>
		)
	}
}