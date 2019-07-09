const DEFAULT_CONFIGURATION = {
	commentLengthLimitForThreadPreview: 500,
	commentLengthLimit: 1000
}

export default {
	...DEFAULT_CONFIGURATION,
	...STAGE_CONFIGURATION
}