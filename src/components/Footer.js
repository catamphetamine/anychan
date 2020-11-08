import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import MainMenu from './MainMenu'

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
		<footer className={classNames(className, 'Footer', {
			'BackgroundContent': isContentSectionsContent(route) || isBoardsLocation(route)
		})}>
			<div className="Content">
				{getChan().links &&
					<FooterChanLinks links={getChan().links}/>
				}
				<div className="Footer-copyright">
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
					<p>
						{getMessages(locale).copyright.preCaptchan}
						<a
							target="_blank"
							href="https://gitlab.com/catamphetamine/captchan">
							<CaptchanLogo className="Footer-captchanLogo"/>
							captchan
						</a>
						{getMessages(locale).copyright.postCaptchan}
						{' '}{VERSION}
						{getMessages(locale).copyright.preAuthor}
						<a
							target="_blank"
							href="https://gitlab.com/catamphetamine">
							@catamphetamine
						</a>
						.
					</p>
				</div>
				{!offline && false &&
					<MainMenu footer/>
				}
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

function FooterChanLinks({ links }) {
	return (
		<nav>
			<ul className="FooterChanLinks">
				{links.map((link, i) => (
					<li key={i} className="FooterChanLinks-listItem">
						<a
							target="_blank"
							href={link.url}>
							{link.text}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}

FooterChanLinks.propTypes = {
	links: PropTypes.shape({
		url: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	})
}