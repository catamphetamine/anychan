import type { InlineElementPostLink } from 'social-components'
import type { Channel, Thread } from './index.js'

export interface PostLink extends InlineElementPostLink {
	channelId: Channel['id'];
	threadId: Thread['id'];
}