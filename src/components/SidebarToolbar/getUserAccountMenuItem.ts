import type { Messages } from '@/types'

import PersonIconOutline from 'frontend-lib/icons/fill-and-outline/person-outline.svg'
import PersonIconFill from 'frontend-lib/icons/fill-and-outline/person-fill.svg'

export default function getUserAccountMenuItem({ messages }: { messages: Messages }) {
	return {
		title: messages.userAccount.title,
		pathname: '/user',
		url: '/user',
		icon: PersonIconOutline,
		iconSelected: PersonIconFill
	}
}