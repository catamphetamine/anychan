import createParser from '../chan-parser'
import { getChanParserSettings, isDeployedOnChanDomain } from '../chan'
import getUrl from '../utility/getUrl'

export default function createChanParser({ censoredWords, messages }) {
	return createParser(
		getChanParserSettings(),
		{
			messages,
			censoredWords,
			addOnContentChange: true,
			expandReplies: true,
			useRelativeUrls: isDeployedOnChanDomain(),
			getUrl
		}
	)
}