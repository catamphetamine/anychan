import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import Markup from './Markup.js'
import ExternalLink from './ExternalLink.js'

import getConfiguration from '../configuration.js'
import isContentSectionsPage from '../utility/routes/isContentSectionsPage.js'
import isChannelsPage from '../utility/routes/isChannelsPage.js'

import useMessages from '../hooks/useMessages.js'
import useRoute from '../hooks/useRoute.js'
import useDataSource from '../hooks/useDataSource.js'
import useBackground from '../hooks/useBackground.js'

import { Content } from 'social-components-react/components/PostContent.js'

import AnychanLogo from '../../assets/images/icon/icon.svg'

import './Footer.css'

export default function Footer({ className }) {
	// const offline = useSelector(state => state.app.offline)

	const messages = useMessages()
	const route = useRoute()
	const dataSource = useDataSource()
	const background = useBackground()

	return (
		<footer className={classNames(className, 'Footer', 'Content', {
			'Content--background': isContentSectionsPage(route) || isChannelsPage(route),
			'Footer--onBackground': background
		})}>
			{getConfiguration().footerMarkup &&
				<Markup
					content={getConfiguration().footerContent}
					markup={getConfiguration().footerMarkup}
					fullWidth={getConfiguration().footerMarkupFullWidth}
					className="Footer-banner"/>
			}
			{dataSource && dataSource.links &&
				<FooterLinks links={dataSource.links}/>
			}
			<div className="Footer-notes">
				{dataSource && dataSource.footnotes &&
					<Content>
						{dataSource.footnotes}
					</Content>
				}
				<p>
					{messages.footnotes.preAnychan}
					<a
						target="_blank"
						href="https://anychans.github.io">
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
		</footer>
	)
}

Footer.propTypes = {
	className: PropTypes.string
}

// const COPYRIGHT_REPORT = {
// 	_html: dataSource.copyrightReport
// }

// footnotes.replace('{year}', (new Date()).getFullYear())

function FooterLinks({ links }) {
	return (
		<nav>
			<ul className="Footer-links">
				{links.map((link, i) => (
					<li key={i} className="Footer-linkItem">
						<ExternalLink
							openInNewTab
							url={link.url}>
							{link.text}
						</ExternalLink>
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