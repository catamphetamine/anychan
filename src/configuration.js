const DEFAULT_CONFIGURATION = {
	commentLengthLimitForThreadPreview: 500,
	commentLengthLimit: 1000,
	generatedQuoteMaxLength: 120
}

export default {
	...DEFAULT_CONFIGURATION,
	...STAGE_CONFIGURATION
}