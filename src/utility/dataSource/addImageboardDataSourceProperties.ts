import type { ImageboardId } from 'imageboard'
import type { DataSource, Channel, Thread, ChannelId, ImageboardDataSourceDefinitionWithResources, DataSourceWithoutResources } from '@/types'

import { getConfig } from 'imageboard'

import addImageboardDataSourceApiFunctions from './addImageboardDataSourceApiFunctions.js'
import getAbsoluteUrl from './getAbsoluteUrl.js'

export default function addImageboardDataSourceProperties<
	T extends Partial<DataSource>
>(dataSourceInfo: T): (
	T extends ImageboardDataSourceDefinitionWithResources ? DataSource : DataSourceWithoutResources
) {
	// Added this assignment to fix TypeScript error.
	const imageboardId = dataSourceInfo.id as ImageboardId

	const imageboardConfig = getConfig(imageboardId)

	type DataSourcePropertiesThatWillBeSetHere =
		'imageboard' |
		'domain' |
		'channelUrl' |
		'threadUrl' |
		'commentUrl' |
		'getAbsoluteUrl' |
		'api'

	// Added this assignment to fix TypeScript error.
	const dataSource = dataSourceInfo as Omit<DataSource, DataSourcePropertiesThatWillBeSetHere> & Partial<Pick<DataSource, DataSourcePropertiesThatWillBeSetHere>>

	addImageboardDataSourceApiFunctions(dataSource)

	// Add `.reportReasons` and `.reportReasonIdForLegalViolation`.
	if (imageboardConfig.reportReasons) {
		dataSource.reportReasons = imageboardConfig.reportReasons.map((reason) => ({
			id: reason.id,
			description: reason.description,
			channelIds: reason.boards
		}))
		if (imageboardConfig.reportReasonIdForLegalViolation) {
			dataSource.reportReasonForLegalViolation = dataSource.reportReasons.find(_ => _.id === imageboardConfig.reportReasonIdForLegalViolation)
		}
	}

	// Add `.getRulesUrl()` function.
	if (imageboardConfig.boardRulesUrl || imageboardConfig.rulesUrl) {
		let channelRulesUrl: string
		if (imageboardConfig.boardRulesUrl) {
			channelRulesUrl = imageboardConfig.boardRulesUrl.replace('{boardId}', '{channelId}')
		}

		dataSource.getRulesUrl = ({ channelId }: { channelId?: ChannelId } = {}) => {
			const rulesUrl = channelRulesUrl
				? channelRulesUrl.replace('{channelId}', channelId)
				: imageboardConfig.rulesUrl
			return getAbsoluteUrl(rulesUrl, { dataSource: dataSource as DataSource })
		}
	}

	dataSource.getCaptchaFrameUrl = ({ channelId, threadId }: {
		channelId: Channel['id'],
		threadId: Thread['id']
	}): string | undefined => {
		if (imageboardConfig.captchaFrameUrl) {
			return imageboardConfig.captchaFrameUrl.replace('{boardId}', channelId).replace('{threadId}', String(threadId))
		}
	}

	dataSource.captchaFrameUrlHasContentSecurityPolicy = imageboardConfig.captchaFrameUrlHasContentSecurityPolicy;

	return dataSource as DataSource
}