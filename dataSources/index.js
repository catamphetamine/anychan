import IMAGEBOARDS from './imageboards/index.js'

// import SomeNonImageboardDATASourceLikeReddit from './some-none-imageboard-data-source-like-reddit'

const DATA_SOURCES = [
	// SomeNonImageboardDATASourceLikeReddit
]

for (const dataSource of DATA_SOURCES) {
	dataSource.supportsCreateThread = () => true
	dataSource.supportsCreateComment = () => true
	dataSource.supportsReportComment = () => true
	dataSource.supportsLogIn = () => true
	dataSource.supportsVote = () => true
	dataSource.supportsGetCaptcha = () => true

	dataSource.hasLogInTokenPassword = () => false
}

export default DATA_SOURCES.concat(IMAGEBOARDS)