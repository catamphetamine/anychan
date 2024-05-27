import type { Imageboard } from 'imageboard'
import type { CreateThreadParameters, CreateThreadResult } from '../../types/index.js'

import createCommentOrThread from './createCommentOrThread.js'

export default async function createThread(imageboard: Imageboard, parameters: CreateThreadParameters): Promise<CreateThreadResult> {
	return await createCommentOrThread(imageboard, parameters)
}