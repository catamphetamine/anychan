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
		if (dataSource.getCaptchaFrameUrl && dataSource.id !== '4chan') {
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
					captchaFrame.frameUrl = proxyFrameUrl(captchaFrameUrl, { proxyUrl, toAbsoluteUrl })
				}

				return {
					captcha: captchaFrame
				}
			}
		}

		// Test "slider" CAPTCHA that is used on `4chan.org`.
		// return {
		// 	captcha: {
		// 		id: '123',
		// 		type: 'text',
		// 		challengeType: 'image-slider',
		// 		expiresAt: new Date(Date.now() + 100000000),
		// 		image: {
		// 			width: 200,
		// 			height: 100,
		// 			type: 'image/png',
		// 			url: 'https://upload.wikimedia.org/wikipedia/commons/7/79/Snbmapa-200x100.png'
		// 		},
		// 		backgroundImage: {
		// 			width: 200,
		// 			height: 100,
		// 			type: 'image/png',
		// 			url: 'https://upload.wikimedia.org/wikipedia/commons/7/73/Logo_NEU_cz_200x100.png'
		// 		}
		// 	},
		// 	captchaParameters: {}
		// } as const

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

function proxyFrameUrl(url: string, {
	proxyUrl,
	toAbsoluteUrl
}: {
	proxyUrl?: string,
	toAbsoluteUrl: (url: string) => string
}) {
	url = getProxiedUrl(url, { proxyUrl })

	// // Will apply `transforms` to the `<iframe/>` content.
	// // These transforms work specifically for `4chan.org` "embedded" CAPTCHA HTML page.
	// const transforms = [
	// 	{
	// 		target: 'content',
	// 		searchFor: 'cUPMDTk: "' + '\\' + '/',
	// 		replaceWith: 'cUPMDTk: "' + toAbsoluteUrl('/')
	// 	},
	// 	{
	// 		target: 'content',
	// 		searchFor: 'cpo.src = \'' + '/',
	// 		replaceWith: 'cpo.src = \'' + toAbsoluteUrl('/')
	// 	}
	// ]

	// Add `transforms` parameter.
	if (url.includes('?')) {
		url += '&'
	} else {
		url += '?'
	}
	// url += `transforms=${encodeURIComponent(JSON.stringify(transforms))}`

	// // Add `iframe` parameter.
	// url += '&'
	url += `iframe=✓`

	return url
}