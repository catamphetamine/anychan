import SettingsIconOutline from 'frontend-lib/icons/fill-and-outline/settings-outline.svg'
import SettingsIconFill from 'frontend-lib/icons/fill-and-outline/settings-fill.svg'

export default function getSettingsMenuItem({ messages }) {
	return {
		title: messages.settings.title,
		pathname: '/settings',
		url: '/settings',
		icon: SettingsIconOutline,
		iconSelected: SettingsIconFill
	}
}