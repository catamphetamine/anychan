import _correctGrammar from './correctGrammar.js'

function correctGrammarEn(text) {
	return _correctGrammar(text, { language: 'en' })
}

function correctGrammarRu(text) {
	return _correctGrammar(text, { language: 'ru' })
}

describe('correctGrammar', () => {
	it('should correct grammar', () => {
		expectToEqual(
			correctGrammarEn('a,b ,c , d, e -- f - g'),
			'a, b, c, d, e — f — g'
		)

		expectToEqual(
			correctGrammarRu('раз.Два'),
			'раз. Два'
		)

		expectToEqual(
			correctGrammarRu('раз(два)'),
			'раз (два)'
		)

		expectToEqual(
			correctGrammarRu('раз?(два)'),
			'раз? (два)'
		)

		expectToEqual(
			correctGrammarRu('"раз"(два)'),
			'"раз" (два)'
		)

		expectToEqual(
			correctGrammarRu('Раз -- два, три - четыре, пять-шесть, семь- восемь. a- b.'),
			'Раз — два, три — четыре, пять-шесть, семь — восемь. a- b.'
		)

		expectToEqual(
			correctGrammarRu('Раз ( два ). Три ( четыре). Пять(шесть). a(b). 1(2).'),
			'Раз (два ). Три (четыре). Пять (шесть). a(b). 1(2).'
		)

		expectToEqual(
			correctGrammarRu('Раз:два. a:b.'),
			'Раз: два. a:b.'
		)

		expectToEqual(
			correctGrammarRu('Раз,два. Три ,четыре. Пять,  шесть. a ,b. a,b. 1 ,2. 1,2.'),
			'Раз, два. Три, четыре. Пять, шесть. a,b. a,b. 1, 2. 1, 2.'
		)

		expectToEqual(
			correctGrammarRu('Раз два ? a b ?'),
			'Раз два? a b?'
		)

		expectToEqual(
			correctGrammarRu('.Раз два'),
			'Раз два'
		)

		expectToEqual(
			correctGrammarRu('.a b'),
			'.a b'
		)

		expectToEqual(
			correctGrammarRu('Раз.Два'),
			'Раз. Два'
		)

		expectToEqual(
			correctGrammarRu('Яндекс.Деньги'),
			'Яндекс. Деньги'
		)

		expectToEqual(
			correctGrammarRu('Раз.Д'),
			'Раз.Д'
		)

		expectToEqual(
			correctGrammarRu('Раз.два'),
			'Раз.два'
		)

		expectToEqual(
			correctGrammarRu('Р.Два'),
			'Р.Два'
		)

		expectToEqual(
			correctGrammarRu('Ab.Cd'),
			'Ab.Cd'
		)

		expectToEqual(
			correctGrammarRu('Раз... Abc...'),
			'Раз… Abc...'
		)
	})
})
