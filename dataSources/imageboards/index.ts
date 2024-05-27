import type { ImageboardId } from 'imageboard'
import type { DataSource, Channel, Thread, ChannelId } from '@/types'

import { getConfig } from 'imageboard'

import addDataSourceApiFunctions from './addDataSourceApiFunctions.js'
import getAbsoluteUrl from '../../src/utility/dataSource/getAbsoluteUrl.js'

import IMAGEBOARD_DATA_SOURCES from './imageboards.js'

// Adds data-source-specific functions to imageboard data sources.
const IMAGEBOARD_DATA_SOURCE_INSTANCES = (IMAGEBOARD_DATA_SOURCES as unknown as ImageboardDataSourceConfig[]).map((dataSourceInfo) => {
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
		'api' |
		'supportsCreateThread' |
		'supportsCreateComment' |
		'supportsReportComment' |
		'supportsLogIn' |
		'supportsVote' |
		'supportsGetCaptcha' |
		'hasLogInTokenPassword'

	// Added this assignment to fix TypeScript error.
	const dataSource = dataSourceInfo as Omit<DataSource, DataSourcePropertiesThatWillBeSetHere> & Partial<Pick<DataSource, DataSourcePropertiesThatWillBeSetHere>>

	addDataSourceApiFunctions(dataSource)

	dataSource.supportsCreateThread = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsCreateComment = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsReportComment = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsLogIn = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'
	dataSource.supportsVote = () => imageboardConfig.engine === 'makaba'
	dataSource.supportsGetCaptcha = () => imageboardConfig.engine === 'makaba' || dataSource.id === '4chan'

	dataSource.hasLogInTokenPassword = () => imageboardConfig.id === '4chan'

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

	// Add `.getChannelRulesUrl()` function.
	if (imageboardConfig.boardRulesUrl || imageboardConfig.rulesUrl) {
		let channelRulesUrl: string
		if (imageboardConfig.boardRulesUrl) {
			channelRulesUrl = imageboardConfig.boardRulesUrl.replace('{boardId}', '{channelId}')
		}

		dataSource.getChannelRulesUrl = (channelId: ChannelId) => {
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
})

export default IMAGEBOARD_DATA_SOURCE_INSTANCES

type ImageboardDataSourceConfig = Omit<DataSource,
	'imageboard' |
	'domain' |
	'channelUrl' |
	'threadUrl' |
	'commentUrl' |
	'getAbsoluteUrl' |
	'api' |
	'supportsFeature' |
	'supportsCreateThread' |
	'supportsCreateComment' |
	'supportsReportComment' |
	'supportsLogIn' |
	'supportsVote' |
	'supportsGetCaptcha' |
	'hasLogInTokenPassword' |
	'icon' |
	'logo' |
	'manifestUrl'
>
