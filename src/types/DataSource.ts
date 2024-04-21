import type { ImageboardId, ImageboardConfig } from 'imageboard'

export interface DataSource {
	imageboard: ImageboardId | ImageboardConfig
}