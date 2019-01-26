import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import { connect } from 'react-redux'
import classNames from 'classnames'

import './Threads.css'

import Post from 'webapp-frontend/src/components/Post'
import { ContentSection, ContentSectionHeader } from 'webapp-frontend/src/components/ContentSection'
import OnClick from 'webapp-frontend/src/components/OnClick'

@connect(({ chan }) => ({
	threads: chan.threads
}))
export default class Threads extends React.Component {
	onThreadClick = (thread) => {
		const link = document.createElement('a')
		link.setAttribute('href', `https://2ch.hk/${thread.board}/res/${thread.id}.html`)
		link.setAttribute('target', '_blank')
		link.click()
	}

	onThreadClickFilter = (element) => {
		const tagName = element.tagName.toLowerCase()
		switch (tagName) {
			case 'img':
			case 'time':
			case 'a':
			case 'button':
				return false
		}
		if (element.classList.contains('post__inline-spoiler-contents')) {
			return false
		}
		return true
	}

	render() {
		const { threads } = this.props

		if (!threads) {
			return null
		}

		// console.log(threads.slice(1, 9)[0].content)

		return (
			<React.Fragment>
				{threads.map((thread) => (
					<OnClick
						key={thread.id}
						filter={this.onThreadClickFilter}
						onClick={() => this.onThreadClick(thread)}
						onClickClassName="threads__thread-container--click"
						className="threads__thread-container">
						<ContentSection
							key={thread.id}
							className={classNames('threads__thread', {
								'threads__thread--with-subject': thread.subject
							})}>
							{thread.subject &&
								<ContentSectionHeader>
									{thread.subject}
								</ContentSectionHeader>
							}
							<Post
								post={thread.openingPost}
								saveBandwidth
								expandFirstPictureOrVideo={false} />
						</ContentSection>
					</OnClick>
				))}
			</React.Fragment>
		)
	}
}

Threads.propTypes = {
	threads: PropTypes.arrayOf(PropTypes.shape({
		id: PropTypes.string.isRequired
	}))
}