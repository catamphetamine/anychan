import expectToEqual from './expectToEqual'

export default function(limitLength) {
	const text = 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games Store.'
	expectToEqual(limitLength(text, text.length - 1), 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games …')

	expectToEqual(limitLength('A b c. D e f. G h', 17), 'A b c. D e f. G h')
	expectToEqual(limitLength('A b c. D e f. G h', 16), 'A b c. D e f.')
	expectToEqual(limitLength('A b c. D e f. G', 12), 'A b c.')
	expectToEqual(limitLength('A b c. D e f. G', 6), 'A b …')
	expectToEqual(limitLength('A b c. D e f. G', 4), 'A b …')
	expectToEqual(limitLength('A b c. D e f. G', 3), 'A …')
	expectToEqual(limitLength('A b c. D e f. G', 2), 'A …')
	expectToEqual(limitLength('A b c. D e f. G', 1), 'A…')
	expectToEqual(limitLength('A b c. D e f. G', 0), '…')

	expectToEqual(limitLength('Abc.', 2), 'Ab…')
	expectToEqual(limitLength('Abc? Def.', 7), 'Abc?')
	expectToEqual(limitLength('Abc! Def.', 7), 'Abc!')

	expectToEqual(limitLength('Abc. Def? Ghi', 12), 'Abc. Def?')
	expectToEqual(limitLength('Abc. Def! Ghi', 12), 'Abc. Def!')
}