import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import ApplicationMenu from './ApplicationMenu'

import getMessages from '../messages'
import { getChan } from '../chan'
import { isContentSectionsContent, isBoardsLocation } from '../utility/routes'

import PostBlock from 'webapp-frontend/src/components/PostBlock'

import CaptchanLogo from '../../assets/images/icon.svg'

import './Footer.css'

export default function Footer({ className }) {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const offline = useSelector(({ app }) => app.offline)
	const route = useSelector(({ found }) => found.resolvedMatch)
	return (
		<footer className={classNames(className, 'footer', {
			'background-content': isContentSectionsContent(route) || isBoardsLocation(route)
		})}>
			<div className="content">
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
							{getChan().copyright}
						</p>
					}
					{Array.isArray(getChan().copyright) &&
						<PostBlock>
							{getChan().copyright}
						</PostBlock>
					}
					<p className="footer__copyright-captchan">
						{getMessages(locale).copyright.preCaptchan}
						<a
							target="_blank"
							href="https://github.com/catamphetamine/captchan">
							<CaptchanLogo className="footer__copyright-captchan-logo"/>
							captchan
						</a>
						{getMessages(locale).copyright.postCaptchan}
						{getMessages(locale).copyright.preAuthor}
						<a
							target="_blank"
							href="https://github.com/catamphetamine">
							@catamphetamine
						</a>
						.
					</p>
				</div>
				{!offline && <ApplicationMenu footer/>}
			</div>
		</footer>
	)
}

Footer.propTypes = {
	className: PropTypes.string
}

const COPYRIGHT_REPORT = {
	_html: getChan().copyrightReport
}

// copyright.replace('{0}', (new Date()).getFullYear())