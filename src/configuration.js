const DEFAULT_CONFIGURATION = {
	commentLengthLimitForThreadPreview: 500,
	commentLengthLimit: 1000,
	generatedQuoteMaxLength: 120,
	generatedQuoteMinFitFactor: 0.5,
	generatedQuoteMaxFitFactor: 1.4
}

export default {
	...DEFAULT_CONFIGURATION,
	...STAGE_CONFIGURATION
}