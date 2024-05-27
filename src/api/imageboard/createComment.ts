import type { Imageboard } from 'imageboard'
import type { CreateCommentParameters, CreateCommentResult } from '../../types/index.js'

import createCommentOrThread from './createCommentOrThread.js'

export default async function createComment(imageboard: Imageboard, parameters: CreateCommentParameters): Promise<CreateCommentResult> {
	return await createCommentOrThread(imageboard, parameters)
}