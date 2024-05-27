import type { Imageboard } from 'imageboard'
import type { GetCaptchaParameters, GetCaptchaResult } from '../../types/index.js'

export default async function getCaptcha(imageboard: Imageboard, {
	channelId,
	...rest
}: GetCaptchaParameters): Promise<GetCaptchaResult> {
	return await imageboard.getCaptcha({
		boardId: channelId,
		...rest
	})
}