import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Markup from './Markup.js'
import ExternalLink from './ExternalLink.js'

import getConfiguration from '../getConfiguration.js'
import isContentSectionsPage from '../utility/routes/isContentSectionsPage.js'
import isChannelsPage from '../utility/routes/isChannelsPage.js'

import useMessage from '../hooks/useMessage.js'
import useMessages from '../hooks/useMessages.js'
import useRoute from '../hooks/useRoute.js'
import useDataSource from '../hooks/useDataSource.js'
import useBackground from '../hooks/useBackground.js'

// @ts-ignore
import { Content } from 'social-components-react/components/PostContent.js'

import AnychanLogo from '../../assets/images/icon/icon.svg'

import './Footer.css'

export default function Footer({ className }: FooterProps) {
	// const offline = useSelector(state => state.app.offline)

	const messages = useMessages()
	const route = useRoute()
	const dataSource = useDataSource()
	const background = useBackground()

	const anychanFootnotesMessageParameters = useMemo(() => ({
		anychan: () => (
			<a
				target="_blank"
				href="https://anychans.github.io">
				<AnychanLogo className="Footer-anychanLogo"/>
				anychan
			</a>
		),
		version: () => window.VERSION,
		author: () => (
			<a
				target="_blank"
				href="https://gitlab.com/catamphetamine">
				@catamphetamine
			</a>
		)
	}), [])

	const anychanFootnotesMessage = useMessage(messages.footnotes.anychan, anychanFootnotesMessageParameters)

	return (
		<footer className={classNames(className, 'Footer', 'Content', {
			'Content--background': isContentSectionsPage(route) || isChannelsPage(route),
			'Footer--onBackground': background
		})}>
			{(getConfiguration().footerMarkupContent || getConfiguration().footerMarkupHtml) &&
				<Markup
					id="footerMarkup"
					content={getConfiguration().footerMarkupContent}
					markup={getConfiguration().footerMarkupHtml}
				/>
			}
			{dataSource && dataSource.links &&
				<FooterLinks links={dataSource.links}/>
			}
			<div className="Footer-notes Footer-block">
				{dataSource && dataSource.footnotes &&
					<Content>
						{dataSource.footnotes}
					</Content>
				}
				<p className="Footer-anychanFootnotes">
					{anychanFootnotesMessage}
				</p>
			</div>
		</footer>
	)
}

Footer.propTypes = {
	className: PropTypes.string
}

interface FooterProps {
	className?: string
}

// const COPYRIGHT_REPORT = {
// 	_html: dataSource.copyrightReport
// }

// footnotes.replace('{year}', (new Date()).getFullYear())

function FooterLinks({ links }: FooterLinksProps) {
	return (
		<nav className="Footer-block">
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

interface FooterLinksProps {
	links: Array<{
		url: string,
		text: string
	}>
}