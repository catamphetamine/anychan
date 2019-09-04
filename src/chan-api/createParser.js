import createParser from '../chan-parser'
import { getChanParserSettings, isDeployedOnChanDomain } from '../chan'
import getMessages from '../messages'
import getUrl from '../utility/getUrl'

export default function createChanParser({ censoredWords, locale }) {
	return createParser(
		getChanParserSettings(),
		{
			censoredWords,
			addOnContentChange: true,
			expandReplies: true,
			messages: locale ? getMessages(locale) : undefined,
			useRelativeUrls: isDeployedOnChanDomain(),
			getUrl
		}
	)
}