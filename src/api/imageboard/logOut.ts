import type { Imageboard } from 'imageboard'
import type { LogOutParameters, LogOutResult } from '@/types'

export default async function logOut(imageboard: Imageboard, parameters: LogOutParameters): Promise<LogOutResult> {
	return await imageboard.logOut()
}