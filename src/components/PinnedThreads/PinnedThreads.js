import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import { thread } from '../../PropTypes.js'

import sortThreadsWithPinnedOnTop from './sortThreadsWithPinnedOnTop.js'

import './PinnedThreads.css'

export default function PinnedThreads({
	threads
}) {
	const pinnedThreads = useMemo(() => {
		return sortThreadsWithPinnedOnTop(threads.filter(_ => _.pinned), _ => _);
	})

	console.log('@ pinnedThreads', pinnedThreads)

	if (pinnedThreads.length === 0) {
		return null
	}

	return (
		<div>
			{pinnedThreads.map((thread) => (
				<div>
					{thread.title}
					<div>
						{thread.comments[0].textPreviewForPageDescription}
					</div>
				</div>
			))}
		</div>
	)
}

PinnedThreads.propTypes = {
	threads: PropTypes.arrayOf(thread).isRequired
}