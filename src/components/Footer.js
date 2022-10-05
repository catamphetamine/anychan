import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import MainMenu from './MainMenu.js'
import Markup from './Markup.js'

import configuration from '../configuration.js'
import { getProvider } from '../provider.js'
import isContentSectionsPage from '../utility/routes/isContentSectionsPage.js'
import isChannelsPage from '../utility/routes/isChannelsPage.js'

import useMessages from '../hooks/useMessages.js'
import useRoute from '../hooks/useRoute.js'

import { Content } from 'social-components-react/components/PostContent.js'

import AnychanLogo from '../../assets/images/icon/icon.svg'

import './Footer.css'

export default function Footer({ className }) {
	const offline = useSelector(state => state.app.offline)
	const messages = useMessages()
	const route = useRoute()

	return (
		<footer className={classNames(className, 'Footer', 'Content', {
			'Content--background': isContentSectionsPage(route) || isChannelsPage(route)
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
					{messages.footnotes.preAnychan}
					<a
						target="_blank"
						href="https://gitlab.com/catamphetamine/anychan">
						<AnychanLogo className="Footer-anychanLogo"/>
						anychan
					</a>
					{messages.footnotes.postAnychan}
					{' '}{VERSION}
					{messages.footnotes.preAuthor}
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
	links: PropTypes.arrayOf(PropTypes.shape({
		url: PropTypes.string.isRequired,
		text: PropTypes.string.isRequired
	})).isRequired
}