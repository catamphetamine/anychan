import type { ChannelId, ThreadId, Captcha, TextCaptchaSolution } from '@/types'

import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { useDataSource, useLocale, useGetCaptcha } from '@/hooks'

import { showError, notify } from '../redux/notifications.js'

import showCaptcha from '../utility/captcha/showCaptcha.js'
import isDeployedOnDataSourceDomain from '../utility/dataSource/isDeployedOnDataSourceDomain.js'

export default function useShowCaptcha({
	channelId,
	threadId
}: {
	channelId?: ChannelId,
	threadId?: ThreadId
}) {
	const dispatch = useDispatch()
	const locale = useLocale()
	const dataSource = useDataSource()

	const getCaptcha = useGetCaptcha({
		channelId,
		threadId
	})

	return useCallback(async ({
		onSubmit
	}: {
		onSubmit: (params: {
			captcha: Captcha,
			captchaSolution: TextCaptchaSolution
		}) => Promise<void>
	}) => {
		const {
			captcha,
			captchaParameters
		} = await getCaptcha()

		// Testing `2ch.hk`:
		// captcha = {
		// 	"id": "b523714e9662a6e0741c3070b96a1c9c7c6591f2c11c9e2b15fdf577fa360e1662391df0a0fe929dc7f6bc6aa576ce851e0b50c9f3cedeefa7f4067b059cacf14ffc3633",
		// 	"type": "text",
		// 	"characterSet": "russian",
		// 	"expiresAt": new Date("2027-01-01T00:00:00.000Z"),
		// 	image: {
		// 		"url": "https://2ch.hk/api/captcha/2chcaptcha/show?id=b523714e9662a6e0741c3070b96a1c9c7c6591f2c11c9e2b15fdf577fa360e1662391df0a0fe929dc7f6bc6aa576ce851e0b50c9f3cedeefa7f4067b059cacf14ffc3633",
		// 		"type": "image/png",
		// 		"width": 270,
		// 		"height": 120
		// 	}
		// }

		console.log('@@@ CAPTCHA:', captcha)
		if (captchaParameters && Object.keys(captchaParameters).length > 0) {
			console.log('@@@ CAPTCHA parameters:', captchaParameters)
		}

		if (dataSource.id === '2ch' && !isDeployedOnDataSourceDomain(dataSource)) {
			if (locale === 'ru') {
				dispatch(notify('Справка: Капча `2ch.hk`, судя по всему, не работает на сайтах, отличных от `2ch.hk`: не грузит картинку, а даже если и грузит, то потом не принимает ответ. Поэтому на текущий момент постинг работает только из-под "пасскода". Войти по "пасскоду" можно нажав на значок пользователя вверху сайдбара.'))
			} else {
				dispatch(notify('Note: `2ch.hk` CAPTCHA image doesn\'t seem to work on a non-`2ch.hk` website: doesn\'t load image, and even if it does, it won\'t accept the solution. So currently, one could only post after logging in with a "passcode". To do that, click the user icon at the top of the sidebar.'))
			}
		}

		// Show a CAPTCHA to the user.
		// If they solve it, then submit the new comment.
		showCaptcha(captcha, captchaParameters, {
			dispatch,
			onSubmit: async ({
				captcha,
				captchaSolution
			}: {
				captcha?: Captcha,
				captchaSolution?: TextCaptchaSolution
			}) => {
				return await onSubmit({
					captcha,
					captchaSolution
				})
			}
		})
	}, [
		getCaptcha,
		dataSource,
		locale
	])
}