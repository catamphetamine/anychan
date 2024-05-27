import type { CaptchaFrame, ChannelId, ThreadId } from '@/types'

import { useCallback } from 'react'

import { useDataSource, useSettings, useLocale, useOriginalDomain, useProxyUrl } from '@/hooks'

import getDataSourceAbsoluteUrl from '@/utility/dataSource/getDataSourceAbsoluteUrl.js'
import getProxiedUrl from '@/utility/proxy/getProxiedUrl.js'

import getCaptcha from '../api/getCaptcha.js'

export default function useGetCaptcha({
	channelId,
	threadId,
	channelIsNotSafeForWork
}: {
	channelId?: ChannelId,
	threadId?: ThreadId,
	channelIsNotSafeForWork?: boolean
}) {
	const dataSource = useDataSource()
	const userSettings = useSettings()
	const locale = useLocale()
	const originalDomain = useOriginalDomain()
	const proxyUrl = useProxyUrl()

	const toAbsoluteUrl = useCallback((url: string) => {
		// Convert a relative URL to an absolute one.
		if (url[0] === '/' && url[1] !== '/') {
			return getDataSourceAbsoluteUrl(dataSource, url, { notSafeForWork: channelIsNotSafeForWork })
		}
		// If it's already an absolute URL, return it as is.
		return url
	}, [
		dataSource
	])

	return useCallback(async () => {
		if (dataSource.getCaptchaFrameUrl) {
			const captchaFrameUrl = dataSource.getCaptchaFrameUrl({
				channelId,
				threadId
			})

			if (captchaFrameUrl) {
				const captchaFrame: CaptchaFrame = {
					type: 'frame',
					frameUrl: toAbsoluteUrl(captchaFrameUrl)
				}

				if (dataSource.captchaFrameUrlHasContentSecurityPolicy) {
					captchaFrame.frameUrl = getProxiedUrl(captchaFrame.frameUrl, { proxyUrl })
				}

				return {
					captcha: captchaFrame
				}
			}
		}

		const {
			captcha,
			...captchaParameters
		} = await getCaptcha({
			channelId,
			threadId,
			dataSource,
			userSettings,
			locale,
			originalDomain
		})

		// Convert CAPTCHA image URL to an absolute one.
		if (captcha.image && captcha.image.url) {
			captcha.image.url = toAbsoluteUrl(captcha.image.url)
		}

		return {
			captcha,
			captchaParameters
		}
	}, [
		channelId,
		threadId,
		dataSource,
		userSettings,
		locale,
		originalDomain,
		toAbsoluteUrl
	])
}