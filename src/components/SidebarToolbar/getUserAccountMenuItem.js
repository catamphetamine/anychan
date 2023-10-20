import PersonIconOutline from 'frontend-lib/icons/fill-and-outline/person-outline.svg'
import PersonIconFill from 'frontend-lib/icons/fill-and-outline/person-fill.svg'

export default function getUserAccountMenuItem({ messages }) {
	return {
		title: messages.userAccount.title,
		pathname: '/user',
		url: '/user',
		icon: PersonIconOutline,
		iconSelected: PersonIconFill
	}
}