import type { Messages } from '@/types'

import SettingsIconOutline from 'frontend-lib/icons/fill-and-outline/settings-outline.svg'
import SettingsIconFill from 'frontend-lib/icons/fill-and-outline/settings-fill.svg'

export default function getSettingsMenuItem({ messages }: { messages: Messages }) {
	return {
		title: messages.settings.title,
		pathname: '/settings',
		url: '/settings',
		icon: SettingsIconOutline,
		iconSelected: SettingsIconFill
	}
}