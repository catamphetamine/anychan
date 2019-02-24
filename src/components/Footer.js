import React from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'

import ApplicationMenu from './ApplicationMenu'
import { isBoardLocation, isThreadLocation } from './Header'

import { getChan } from '../chan'

import { PostBlock } from 'webapp-frontend/src/components/Post'

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
						<p>
							{getChan().copyright.replace('{0}', (new Date()).getFullYear())}
						</p>
						{getChan().copyrightReport &&
							<PostBlock>
								{getChan().copyrightReport}
							</PostBlock>
						}
						<p className="footer__copyright-chanchan">
							<a
								target="_blank"
								href="https://github.com/catamphetamine/chanchan">
								chanchan imageboard client
							</a>
							{' by '}
							<a
								target="_blank"
								href="https://github.com/catamphetamine">
								@catamphetamine
							</a>
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