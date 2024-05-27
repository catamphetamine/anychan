import React from 'react'

// @ts-expect-error
import { ExpansionPanel } from 'react-responsive-ui'

import {
	ContentSection,
	ContentSectionHeader
} from 'frontend-lib/components/ContentSection.js'

import Table from '../Table.js'

import useMessages from '../../hooks/useMessages.js'

export default function KeyboardShortcuts() {
	const messages = useMessages()

	const headers = [
		messages.settings.keyboardShortcuts.keys,
		messages.settings.keyboardShortcuts.action
	]

	const rows = {
		NAVIGATION: [
			[
				'Backspace',
				messages.settings.keyboardShortcuts.navigation.goBackToTheListOfThreads
			]
		],
		VIDEO_PLAYER: [
			[
				'↑',
				messages.settings.keyboardShortcuts.videoPlayer.volumeUp
			],
			[
				'↓',
				messages.settings.keyboardShortcuts.videoPlayer.volumeDown
			],
			[
				'M',
				messages.settings.keyboardShortcuts.videoPlayer.volumeMuteUnmute
			],
			[
				'F',
				messages.settings.keyboardShortcuts.videoPlayer.enterExitFullscreen
			],
			[
				'Spacebar',
				messages.settings.keyboardShortcuts.videoPlayer.playPause
			],
			[
				'→',
				messages.settings.keyboardShortcuts.videoPlayer.jumpForwardSmall
			],
			[
				'←',
				messages.settings.keyboardShortcuts.videoPlayer.jumpBackwardSmall
			],
			[
				'Shift ＋ →',
				messages.settings.keyboardShortcuts.videoPlayer.jumpForwardMedium
			],
			[
				'Shift ＋ ←',
				messages.settings.keyboardShortcuts.videoPlayer.jumpBackwardMedium
			],
			[
				'Home',
				messages.settings.keyboardShortcuts.videoPlayer.jumpToStart
			],
			[
				'End',
				messages.settings.keyboardShortcuts.videoPlayer.jumpToEnd
			]
		]
	}

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.keyboardShortcuts.title}
			</ContentSectionHeader>

			<ExpansionPanel title={messages.settings.keyboardShortcuts.navigation.title}>
				<Table
					headers={headers}
					rows={rows.NAVIGATION}/>
			</ExpansionPanel>

			<ExpansionPanel title={messages.settings.keyboardShortcuts.videoPlayer.title}>
				<Table
					headers={headers}
					rows={rows.VIDEO_PLAYER}/>
			</ExpansionPanel>
		</ContentSection>
	)
}