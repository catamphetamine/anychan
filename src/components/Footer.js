import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import MainMenu from './MainMenu'
import Markup from './Markup'

import configuration from '../configuration'
import getMessages from '../messages'
import { getProvider } from '../provider'
import { isContentSectionsContent, isChannelsLocation } from '../utility/routes'

import { Content } from 'webapp-frontend/src/components/PostContent'

import CaptchanLogo from '../../assets/images/icon.svg'

import './Footer.css'

export default function Footer({ className }) {
	const locale = useSelector(({ settings }) => settings.settings.locale)
	const offline = useSelector(({ app }) => app.offline)
	const route = useSelector(({ found }) => found.resolvedMatch)
	return (
		<footer className={classNames(className, 'Footer', 'Content', {
			'Content--background': isContentSectionsContent(route) || isChannelsLocation(route)
		})}>
			{configuration.footerMarkup &&
				<Markup
					content={configuration.footerContent}
					markup={configuration.footerMarkup}
					fullWidth={configuration.footerMarkupFullWidth}
					className="Footer-banner"/>
			}
			{getProvider() && getProvider().links &&
				<FooterLinks links={getProvider().links}/>
			}
			<div className="Footer-notes">
				{getProvider() && getProvider().footnotes &&
					<Content>
						{getProvider().footnotes}
					</Content>
				}
				<p>
					{getMessages(locale).footnotes.preCaptchan}
					<a
						target="_blank"
						href="https://gitlab.com/catamphetamine/captchan">
						<CaptchanLogo className="Footer-captchanLogo"/>
						captchan
					</a>
					{getMessages(locale).footnotes.postCaptchan}
					{' '}{VERSION}
					{getMessages(locale).footnotes.preAuthor}
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
		</footer>
	)
}

Footer.propTypes = {
	className: PropTypes.string
}

// const COPYRIGHT_REPORT = {
// 	_html: getProvider().copyrightReport
// }

// footnotes.replace('{year}', (new Date()).getFullYear())

function FooterLinks({ links }) {
	return (
		<nav>
			<ul className="Footer-links">
				{links.map((link, i) => (
					<li key={i} className="Footer-linkItem">
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

FooterLinks.propTypes = {
	links: PropTypes.shape({
		url: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	})
}