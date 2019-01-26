import { ReduxModule } from 'react-website'

import { isEqual, flatten } from 'lodash'

const redux = new ReduxModule()

export const getBoards = redux.action(
	() => async http => {
		// Remove this before pushing.
		let response
		if (process.env.NODE_ENV !== 'production') {
			response = {"boards":[{"bump_limit":500,"category":"Разное","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"b","info":"бред","last_num":186855586,"name":"Бред","speed":489,"threads":211,"unique_posters":6206},{"bump_limit":500,"category":"Политика","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"po","info":"политика, новости, ольгинцы, хохлы, либерахи, рептилоиды.. oh shi","last_num":30721377,"name":"Политика","speed":147,"threads":175,"unique_posters":2692},{"bump_limit":13666,"category":"Политика","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"news","info":"новости","last_num":4078197,"name":"Новости","speed":127,"threads":661,"unique_posters":3107},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"sex","info":"секс, отношения, еот, еок, биопроблемы","last_num":4935527,"name":"Секс и отношения","speed":124,"threads":141,"unique_posters":1623},{"bump_limit":1000,"category":"Игры","default_name":"Аноним","enable_names":0,"enable_sage":0,"id":"vg","info":"Видеоигры, general, официальные треды","last_num":28333219,"name":"Video Games General","speed":54,"threads":123,"unique_posters":3511},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fag","info":"фагготрия, богини","last_num":6289258,"name":"Фагготрия","speed":35,"threads":105,"unique_posters":1531},{"bump_limit":500,"category":"Тематика","default_name":"Обреченный","enable_names":0,"enable_sage":1,"id":"rf","info":"убежище, социофобия","last_num":3244646,"name":"Убежище","speed":28,"threads":200,"unique_posters":310},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"v","info":"Видеоигры, random","last_num":3545965,"name":"Video Games","speed":27,"threads":121,"unique_posters":1309},{"bump_limit":500,"category":"Пользовательские","default_name":"Аниме","enable_names":1,"enable_sage":1,"id":"2d","info":"Щитпостинг, обсуждение вайфу, аватарки и прочее. Анимешный /b/, постинг 3d не приветствуется.","last_num":804259,"name":"Аниме/Беседка","speed":25,"threads":401,"unique_posters":209},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"cg","info":"консоли, playstation, xbox, nintendo","last_num":1425173,"name":"Консоли","speed":16,"threads":202,"unique_posters":528},{"bump_limit":1000,"category":"Техника и софт","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mobi","info":"мобильные телефоны, приложения, iphone, android, winphone, 2ch browser","last_num":1532520,"name":"Мобильные устройства и приложения","speed":14,"threads":292,"unique_posters":548},{"bump_limit":2000,"category":"Техника и софт","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ra","info":"радиолюбители, связь, радиотехника","last_num":346272,"name":"Радиотехника","speed":13,"threads":201,"unique_posters":129},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"to","info":"","last_num":89962,"name":"Touhou","speed":13,"threads":132,"unique_posters":58},{"bump_limit":500,"category":"Техника и софт","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"s","info":"linux, windows, шиндовс, программы","last_num":2426909,"name":"Программы","speed":11,"threads":201,"unique_posters":382},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"au","info":"автомобили, семейные биопроблемы, шкворни, патриот, сломалась дсг, тазопроблемы","last_num":4684884,"name":"Автомобили","speed":11,"threads":160,"unique_posters":565},{"bump_limit":500,"category":"Техника и софт","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"hw","info":"железо, видеокарты, ноутбуки, intel, amd, nvidia, ati","last_num":3235919,"name":"Компьютерное железо","speed":10,"threads":205,"unique_posters":843},{"bump_limit":500,"category":"Техника и софт","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"t","info":"техника, технологии, компьютерная периферия","last_num":876392,"name":"Техника","speed":10,"threads":201,"unique_posters":172},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mov","info":"фильмы, кино, новинки, сериалы в /tv/","last_num":2022729,"name":"Фильмы","speed":10,"threads":141,"unique_posters":620},{"bump_limit":500,"category":"Творчество","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"wrk","info":"работа, карьера, офис, макдональдс","last_num":1424622,"name":"Работа и карьера","speed":10,"threads":201,"unique_posters":445},{"bump_limit":500,"category":"Японская культура","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"a","info":"аниме, 2d, вайфу","last_num":5707087,"name":"Аниме","speed":8,"threads":154,"unique_posters":920},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"sp","info":"спорт, спортивные игры, футбол в /ftb/","last_num":1605868,"name":"Спорт","speed":7,"threads":141,"unique_posters":309},{"bump_limit":1000,"category":"Тематика","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"wm","info":"военная техника, армии, вооруженные конфликты","last_num":3107517,"name":"Военная техника","speed":7,"threads":101,"unique_posters":230},{"bump_limit":500,"category":"Разное","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"soc","info":"сходки, знакомства, деанонимизация","last_num":4761319,"name":"Общение","speed":7,"threads":143,"unique_posters":826},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"bi","info":"велосипеды, dmx","last_num":760235,"name":"Велосипеды","speed":5,"threads":201,"unique_posters":153},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"em","info":"эмиграция, страны","last_num":528609,"name":"Другие страны","speed":5,"threads":79,"unique_posters":204},{"bump_limit":500,"category":"Техника и софт","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"pr","info":"программирование, быдлокодинг","last_num":1298000,"name":"Программирование","speed":5,"threads":202,"unique_posters":416},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"sci","info":"наука","last_num":453264,"name":"Наука","speed":5,"threads":201,"unique_posters":98},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"zog","info":"не стоит вскрывать эту тему","last_num":298359,"name":"Теории заговора","speed":5,"threads":399,"unique_posters":85},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"c","info":"комиксы, мультфильмы","last_num":955594,"name":"Комиксы и мультфильмы","speed":4,"threads":141,"unique_posters":161},{"bump_limit":800,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fiz","info":"физкультура, здоровье, сбросить вес, набрать вес, бицуха","last_num":1320686,"name":"Физкультура","speed":4,"threads":202,"unique_posters":303},{"bump_limit":500,"category":"Творчество","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"di","info":"еда, хрючево, столовая, рецепты","last_num":377283,"name":"Столовая","speed":4,"threads":201,"unique_posters":161},{"bump_limit":500,"category":"Японская культура","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"ma","info":"манга, наруто, блич, японские комиксы","last_num":1198179,"name":"Манга","speed":4,"threads":97,"unique_posters":293},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"gg","info":"","last_num":720055,"name":"Хорошие девушки","speed":4,"threads":121,"unique_posters":219},{"bump_limit":1000,"category":"Техника и софт","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"gd","info":"gamedev, игрострой, эльфы набегают","last_num":537626,"name":"Gamedev","speed":4,"threads":602,"unique_posters":119},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fa","info":"мода, стиль, шмотки, стрижки, партаки, рюкзаки, парфюм","last_num":1110462,"name":"Мода и стиль","speed":3,"threads":200,"unique_posters":366},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"me","info":"медицина, здоровье, диагностика, сходи к врачу","last_num":804355,"name":"Медицина","speed":3,"threads":175,"unique_posters":441},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"spc","info":"космос, астрономия, вселенные, звезды, огурцы","last_num":442950,"name":"Космос и астрономия","speed":3,"threads":120,"unique_posters":146},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"tv","info":"сериалы для домохозяек, игры престолов в /got/","last_num":2214931,"name":"Сериалы","speed":3,"threads":141,"unique_posters":277},{"bump_limit":1000,"category":"Творчество","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"pa","info":"живопись, рисунки, художники","last_num":524004,"name":"Живопись","speed":3,"threads":197,"unique_posters":200},{"bump_limit":500,"category":"Творчество","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"p","info":"фотография, фототехника, объективы, canon, nikon, sony, pentax","last_num":595359,"name":"Фотография","speed":3,"threads":202,"unique_posters":126},{"bump_limit":500,"category":"Взрослым","default_name":"уточка","enable_names":1,"enable_sage":1,"id":"fg","info":"","last_num":603406,"name":"Трапы","speed":3,"threads":203,"unique_posters":262},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mu","info":"музыка, илита","last_num":1559452,"name":"Музыка","speed":3,"threads":201,"unique_posters":289},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"e","info":"","last_num":357870,"name":"Extreme Pron","speed":3,"threads":151,"unique_posters":226},{"bump_limit":500,"category":"Пользовательские","default_name":"Товарищ","enable_names":1,"enable_sage":1,"id":"ussr","info":"","last_num":61721,"name":"СССР","speed":3,"threads":401,"unique_posters":32},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ch","info":"Уютные чатики и конфочки","last_num":69882,"name":"Чатики и конфочки","speed":3,"threads":401,"unique_posters":84},{"bump_limit":1000,"category":"Политика","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"hry","info":"ютуб блогеры, шарий, мальцев, камикадзе","last_num":24637,"name":"Highlights of Russian-speaking youtube","speed":3,"threads":175,"unique_posters":190},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"hh","info":"хипхоп, рэп, олдскул","last_num":782565,"name":"Hip-Hop","speed":2,"threads":202,"unique_posters":58},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mg","info":"магия, астрал, вуду, руны, псионика, суккубы","last_num":399073,"name":"Магия","speed":2,"threads":203,"unique_posters":98},{"bump_limit":500,"category":"Тематика","default_name":"Pony","enable_names":1,"enable_sage":1,"id":"mlp","info":"Мои маленькие пони, дружба, магия","last_num":4112202,"name":"My Little Pony","speed":2,"threads":107,"unique_posters":143},{"bump_limit":1000,"category":"Творчество","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"diy","info":"хобби, лего, клеить танчики, вышивание","last_num":465876,"name":"Хобби","speed":2,"threads":202,"unique_posters":171},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"td","info":"","last_num":108498,"name":"Трёхмерная графика","speed":2,"threads":201,"unique_posters":70},{"bump_limit":500,"category":"Японская культура","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fd","info":"фэндом, косплей, японская культура, аниме","last_num":1498378,"name":"Фэндом","speed":2,"threads":202,"unique_posters":150},{"bump_limit":1000,"category":"Японская культура","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"vn","info":"визуальные новеллы","last_num":484743,"name":"Визуальные новеллы","speed":2,"threads":965,"unique_posters":82},{"bump_limit":500,"category":"Пользовательские","default_name":"Попаданец","enable_names":1,"enable_sage":1,"id":"fs","info":"фэнтези","last_num":209939,"name":"Фэнтези","speed":2,"threads":202,"unique_posters":100},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fet","info":"","last_num":362746,"name":"Фетиш","speed":2,"threads":201,"unique_posters":252},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"hc","info":"","last_num":342133,"name":"Hardcore","speed":2,"threads":200,"unique_posters":151},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"cc","info":"","last_num":407949,"name":"Криптовалюта","speed":2,"threads":402,"unique_posters":190},{"bump_limit":1500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"dr","info":"блог, дневник, атеншвхоринг","last_num":231384,"name":"Дневнички","speed":2,"threads":2001,"unique_posters":134},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"math","info":"Доска о модулях над кольцами, пучках на многообразиях и гомологиях с когомологиями.","last_num":45564,"name":"Математика","speed":2,"threads":256,"unique_posters":51},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"bo","info":"книги, чтение","last_num":545421,"name":"Книги","speed":1,"threads":203,"unique_posters":136},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"hi","info":"история","last_num":464578,"name":"История","speed":1,"threads":201,"unique_posters":148},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mo","info":"Мотоциклы, скутеры, трайки, экипировка","last_num":235155,"name":"Мотоциклы","speed":1,"threads":201,"unique_posters":44},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"psy","info":"психология, психиатрия","last_num":941970,"name":"Психология и психиатрия","speed":1,"threads":191,"unique_posters":249},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"un","info":"образование, вуз, школа, поступление, гиа, егэ, уже не школьник","last_num":641036,"name":"Образование","speed":1,"threads":206,"unique_posters":135},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"wh","info":"вархаммер ФБ, вархаммер 4000","last_num":794064,"name":"Warhammer","speed":1,"threads":202,"unique_posters":179},{"bump_limit":500,"category":"Творчество","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"de","info":"","last_num":61834,"name":"Дизайн","speed":1,"threads":200,"unique_posters":37},{"bump_limit":500,"category":"Творчество","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mus","info":"музыкальные инструменты, вокал, DAW, звукозапись, диджеи, дикторы","last_num":623336,"name":"Музыканты","speed":1,"threads":205,"unique_posters":211},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mmo","info":"multiplayer games, mmo, wow, wot, eve, lineage","last_num":6540574,"name":"Massive multiplayer online games","speed":1,"threads":61,"unique_posters":28},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"tes","info":"TES, elder scrolls, morrowind, skyrim, oblivion, fusrodah","last_num":1238657,"name":"The Elder Scrolls","speed":1,"threads":200,"unique_posters":261},{"bump_limit":500,"category":"Разное","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"d","info":"двач, модерация, разбань, забань, убери, верни, зделай","last_num":576103,"name":"Дискуссии о Два.ч","speed":1,"threads":143,"unique_posters":331},{"bump_limit":500,"category":"Разное","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"r","info":"реквесты, ищу пикчу, вебмку, пасту","last_num":160027,"name":"Просьбы","speed":1,"threads":201,"unique_posters":59},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ga","info":"","last_num":1494042,"name":"Геи","speed":1,"threads":141,"unique_posters":275},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"h","info":"","last_num":130844,"name":"Хентай","speed":1,"threads":200,"unique_posters":73},{"bump_limit":500,"category":"Пользовательские","default_name":"Тутэйшы","enable_names":1,"enable_sage":1,"id":"by","info":"беларусь, змагары, картоха, батька","last_num":137976,"name":"Беларусь","speed":1,"threads":401,"unique_posters":35},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"alco","info":"алкоголь, алкотреды, собутыльники","last_num":639692,"name":"Алкоголь","speed":1,"threads":409,"unique_posters":131},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"vape","info":"электроные сигареты, вейп, электронные кальяны","last_num":421788,"name":"Электронные сигареты","speed":1,"threads":401,"unique_posters":96},{"bump_limit":1000,"category":"Пользовательские","default_name":"Маляр","enable_names":1,"enable_sage":1,"id":"gsg","info":"Доска о стратегиях","last_num":772574,"name":"Grand Strategy Games","speed":1,"threads":81,"unique_posters":205},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"obr","info":"Отдельная от hh доска, посвященная исключительно оффлайн баттлам типа SLOVO и VERSUS с кучей тредов по отдельным феноменам (группи из толпы) и отдельным персонажам.","last_num":31752,"name":"Offline Battle Rap","speed":1,"threads":143,"unique_posters":71},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"hv","info":"Обмен и обсуждение информацией о акциях, промокодов, почтовой халяве, бонусхайтинг и многое другое. Тут Вы сможете найти различную халяву от шариковой ручки до цифрового кода в игру. ","last_num":6107,"name":"Халява в интернете","speed":1,"threads":400,"unique_posters":11},{"bump_limit":500,"category":"Пользовательские","default_name":"Пионер","enable_names":1,"enable_sage":1,"id":"es","info":"","last_num":854407,"name":"Бесконечное Лето","speed":1,"threads":203,"unique_posters":121},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"biz","info":"бизнес, сириуз бизнес","last_num":1010048,"name":"Бизнес","speed":0,"threads":195,"unique_posters":178},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ew","info":"","last_num":167019,"name":"Конец света","speed":0,"threads":200,"unique_posters":10},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fl","info":"иностранные языки, мунспик, эльфийский","last_num":384588,"name":"Иностранные языки","speed":0,"threads":201,"unique_posters":113},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ftb","info":"футбол, премьер лига, ногомяч","last_num":1919658,"name":"Футбол","speed":0,"threads":198,"unique_posters":207},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ne","info":"","last_num":143083,"name":"Животные и природа","speed":0,"threads":193,"unique_posters":47},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"pvc","info":"","last_num":39001,"name":"Фигурки","speed":0,"threads":158,"unique_posters":8},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ph","info":"","last_num":77028,"name":"Философия","speed":0,"threads":202,"unique_posters":28},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"re","info":"религия, религиозная философия","last_num":575686,"name":"Религия","speed":0,"threads":180,"unique_posters":99},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"sf","info":"научная фантастика, science fiction, sci-fi","last_num":161108,"name":"Научная фантастика","speed":0,"threads":202,"unique_posters":62},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"sn","info":"крипи, паранормальные явления","last_num":529150,"name":"Паранормальные явления","speed":0,"threads":202,"unique_posters":114},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"tr","info":"","last_num":77168,"name":"Транспорт и авиация","speed":0,"threads":200,"unique_posters":19},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"w","info":"оружие, ножи, стволы","last_num":426745,"name":"Оружие","speed":0,"threads":202,"unique_posters":154},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"dom","info":"","last_num":136477,"name":"Домострой","speed":0,"threads":201,"unique_posters":91},{"bump_limit":500,"category":"Пользовательские","default_name":"Джеймс","enable_names":1,"enable_sage":1,"id":"izd","info":"графомания, пасты, рассказы, романы","last_num":91271,"name":"Графомания","speed":0,"threads":202,"unique_posters":24},{"bump_limit":500,"category":"Творчество","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"wp","info":"","last_num":63590,"name":"Обои и высокое разрешение","speed":0,"threads":201,"unique_posters":18},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"bg","info":"настольные игры","last_num":1380604,"name":"Настольные игры","speed":0,"threads":201,"unique_posters":108},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mc","info":"майнкрафт, сервера","last_num":352747,"name":"Minecraft","speed":0,"threads":194,"unique_posters":55},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"wr","info":"текстовые рпг","last_num":628443,"name":"Текстовые авторские рпг","speed":0,"threads":200,"unique_posters":45},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"aa","info":"","last_num":95771,"name":"Аниме арт","speed":0,"threads":201,"unique_posters":14},{"bump_limit":1000,"category":"Японская культура","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ja","info":"","last_num":42887,"name":"Японская культура","speed":0,"threads":69,"unique_posters":24},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"rm","info":"","last_num":131495,"name":"Rozen Maiden","speed":0,"threads":57,"unique_posters":9},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fur","info":"","last_num":183528,"name":"Фурри","speed":0,"threads":200,"unique_posters":51},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ho","info":"","last_num":65304,"name":"Прочий хентай","speed":0,"threads":201,"unique_posters":25},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"web","info":"вебмастера, seo, реклама, пиар","last_num":117754,"name":"Web-мастера","speed":0,"threads":201,"unique_posters":26},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"br","info":"","last_num":96082,"name":"Барахолка","speed":0,"threads":85,"unique_posters":27},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"trv","info":"","last_num":48479,"name":"Путешествия и отдых","speed":0,"threads":201,"unique_posters":24},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"gb","info":"","last_num":42192,"name":"Азартные игры","speed":0,"threads":201,"unique_posters":7},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"moba","info":"dota, lol, hots, moba","last_num":2868763,"name":"Multiplayer Online Battle Arena games","speed":0,"threads":46,"unique_posters":3},{"bump_limit":500,"category":"Разное","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"abu","info":"","last_num":59415,"name":"abu","speed":0,"threads":68,"unique_posters":18},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"cul","info":"","last_num":7536,"name":"Культура","speed":0,"threads":136,"unique_posters":5},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"out","info":"","last_num":58123,"name":"Активный отдых","speed":0,"threads":360,"unique_posters":28},{"bump_limit":1000,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"old","info":"","last_num":71785,"name":"Олдфаги","speed":0,"threads":400,"unique_posters":7},{"bump_limit":500,"category":"Разное","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"media","info":"webm, gif, youtube, медиа","last_num":129077,"name":"Анимация","speed":0,"threads":77,"unique_posters":34},{"bump_limit":500,"category":"Взрослым","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"guro","info":"","last_num":13879,"name":"Шок-контент","speed":0,"threads":386,"unique_posters":5},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"jsf","info":"","last_num":56179,"name":"Japanese Street Fashion","speed":0,"threads":206,"unique_posters":4},{"bump_limit":1000,"category":"Пользовательские","default_name":"Безосібний","enable_names":1,"enable_sage":1,"id":"ukr","info":"украина, че там у хохлов","last_num":696069,"name":"/Ukr/aine — Україна","speed":0,"threads":161,"unique_posters":44},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"sw","info":"","last_num":119775,"name":"Star Wars","speed":0,"threads":354,"unique_posters":31},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"law","info":"","last_num":27860,"name":"Право и правоприменители","speed":0,"threads":401,"unique_posters":22},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"m","info":"Тематика для всей научной фантастики с роботами и космическими кораблями. Гандамы, Метал Гиры и прочее. ","last_num":4293,"name":"Меха","speed":0,"threads":75,"unique_posters":0},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ya","info":"","last_num":15968,"name":"Яой","speed":0,"threads":180,"unique_posters":13},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"r34","info":"","last_num":5439,"name":"Правило 34","speed":0,"threads":174,"unique_posters":1},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"qtr4","info":"","last_num":24964,"name":"qtr4","speed":0,"threads":73,"unique_posters":21},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"wow","info":"wow, world of warcraft","last_num":248941,"name":"World of Warcraft","speed":0,"threads":400,"unique_posters":80},{"bump_limit":500,"category":"Пользовательские","default_name":"Рвач","enable_names":0,"enable_sage":1,"id":"gabe","info":"steam, скидки, steamgifts, габен","last_num":438643,"name":"Gabe Logan Newell","speed":0,"threads":141,"unique_posters":24},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"cute","info":"Уютная доска о милых и приятных вещах. Как связанных с аниме (кавай), так и нет.","last_num":9307,"name":"Милое","speed":0,"threads":96,"unique_posters":0},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"se","info":"самообразование, мотивация, специалисты","last_num":70228,"name":"Самообразование","speed":0,"threads":402,"unique_posters":43},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"kz","info":"Казахстан алга!","last_num":58668,"name":"Казачан","speed":0,"threads":400,"unique_posters":15},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"8","info":"Чиптюн, пиксельарт и прочий эйтбит.","last_num":3456,"name":"8bit","speed":0,"threads":73,"unique_posters":4},{"bump_limit":1000,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"brg","info":"Доска для игр, не требующих скачивания клиента и работающих через браузеры.","last_num":940359,"name":"Браузерные игры","speed":0,"threads":58,"unique_posters":87},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"mlpr","info":"Доска находится на стыке /mlp/ и /wr/. В ней проводятся и обсуждаются текстовые игры по цветным коням. ","last_num":93434,"name":"My Little Pony Roleplay","speed":0,"threads":152,"unique_posters":0},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ro","info":"Обсуждаем rogue-like игры вместе с аноном.Спешишь поделиться своим очередным YASD в ADOM или Nethack? Нужен совет по тактике в Stone Soup? Тогда тебе к нам!","last_num":33798,"name":"Рогалики","speed":0,"threads":153,"unique_posters":11},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"who","info":"Доска для обсуждения всего, связанного со вселенной Доктора Кто: тв-эпизодов, комиксов, книг, дополнительных материалов, актеров и общей культуры whoвианов.","last_num":2646,"name":"Doctor Who","speed":0,"threads":70,"unique_posters":0},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"srv","info":"Обсуждение серверов, впс, дедиков, облачных хостеров, серверного софта, в частности всяких оунклаудов, сеафайлов, может даже яндексдисковмегшугарсинков и т.д.","last_num":2410,"name":"Серверы","speed":0,"threads":114,"unique_posters":0},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"asmr","info":"АСМР (Автоно́мная се́нсорная меридиона́льная реа́кция) - феномен восприятия, характеризующийся отчётливым приятным ощущением покалывания в коже головы или других частях тела в ответ на определённые зрительные, слуховые и (или) когнитивные стимулы.","last_num":28923,"name":"ASMR","speed":0,"threads":26,"unique_posters":20},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"electrach","info":"Доска об электронной музыке в широком диапазоне синтипопа до авангарда. ","last_num":17681,"name":"Электронная музыка","speed":0,"threads":397,"unique_posters":0},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ing","info":"Доска посвящена инженерному делу и всему, что с ним связанно. CAD-системы, чертежи, спецификации, конструирование и проектирование.","last_num":2356,"name":"Инженерное дело","speed":0,"threads":150,"unique_posters":3},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"got","info":"игра престолов, джон сноу умер","last_num":166045,"name":"Песнь льда и пламени","speed":0,"threads":96,"unique_posters":1},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"crypt","info":"Доска, где собираются криптоанархисты и другие школьники. Обсуждение tor, i2p, freenet, скрытосетьнэйм, криптомессэнджернэйм, шифрованию, анонимности, и так далее. ","last_num":41225,"name":"Криптоанархия","speed":0,"threads":201,"unique_posters":4},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"socionics","info":"В этом разделе вы можете узнать соционическую матчасть и развеять популярные мифы об этой типологии.","last_num":34895,"name":"Соционика и психософия","speed":0,"threads":200,"unique_posters":34},{"bump_limit":500,"category":"Пользовательские","default_name":"Лапник","enable_names":1,"enable_sage":1,"id":"lap","info":"Доска для любителей автопутешествий и оффроада. Обсуждения выбора автомобилей, оборудования, снаряжения, планирование выездов и просто трёп.","last_num":51859,"name":"Лапник (4x4 клуб)","speed":0,"threads":246,"unique_posters":1},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"smo","info":"Электронные сигареты, трубки, кальяны, самокрутки. И помните, КУРЕНИЕ УБИВАЕТ.","last_num":15236,"name":"Курение","speed":0,"threads":159,"unique_posters":32},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"hg","info":"Хентайные игры","last_num":4785,"name":"Хентайные игры/hentai games","speed":0,"threads":187,"unique_posters":5},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"sad","info":"Доска о садоводстве, ландшафтном дизайне, выращивании на балконе овощей и приправ и т.д.","last_num":4997,"name":"Садоводство","speed":0,"threads":132,"unique_posters":1},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"fi","info":"Доска о рыбалке и ее видах.","last_num":21923,"name":"Рыбалка","speed":0,"threads":144,"unique_posters":2},{"bump_limit":1000,"category":"Пользовательские","default_name":"Аноним","enable_names":0,"enable_sage":1,"id":"nvr","info":"Доска о Новороссии. Обсуждение непризнанных Народных Луганской и Донецкой Республик","last_num":1058445,"name":"Новороссия: ЛНР, ДНР","speed":0,"threads":101,"unique_posters":7},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ind","info":"Для всех-всех-всех инди игр.","last_num":2053,"name":"Инди","speed":0,"threads":52,"unique_posters":1},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"ld","info":"Доска об осознанных сновидениях, их практике и теории.","last_num":13694,"name":"Осознанные сновидения","speed":0,"threads":258,"unique_posters":12},{"bump_limit":500,"category":"Пользовательские","default_name":"Анонимка","enable_names":1,"enable_sage":1,"id":"fem","info":"Доска для феминисток.","last_num":54158,"name":"Феминизм","speed":0,"threads":402,"unique_posters":10},{"bump_limit":500,"category":"Пользовательские","default_name":"Оппа","enable_names":0,"enable_sage":1,"id":"kpop","info":"kpop, корейская культура, бурятки, -_-","last_num":601751,"name":"K-pop","speed":0,"threads":51,"unique_posters":42},{"bump_limit":500,"category":"Пользовательские","default_name":"","enable_names":1,"enable_sage":1,"id":"vr","info":"virtual reality, oculus","last_num":12562,"name":"Виртуальная реальность","speed":0,"threads":76,"unique_posters":2},{"bump_limit":500,"category":"Тематика","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"o","info":"рисовач, оеэкаки, oekaki","last_num":29809,"name":"Рисовач","speed":0,"threads":151,"unique_posters":41},{"bump_limit":500,"category":"Пользовательские","default_name":"","enable_names":1,"enable_sage":1,"id":"arg","info":"","last_num":10799,"name":"ARG/игры в альтернативной реальности","speed":0,"threads":59,"unique_posters":1},{"bump_limit":500,"category":"Пользовательские","default_name":"Номад","enable_names":0,"enable_sage":1,"id":"char","info":"","last_num":4154,"name":"Сетевые персонажи","speed":0,"threads":93,"unique_posters":0},{"bump_limit":500,"category":"Игры","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"pok","info":"покемоны, pokemon go","last_num":69952,"name":"Pokemon","speed":0,"threads":150,"unique_posters":13},{"bump_limit":500,"category":"Пользовательские","default_name":"Аноним","enable_names":1,"enable_sage":1,"id":"wwe","info":"Доска, посвященная рестлингу: WWE, NXT, TNA, ROH, NJPW, Lucha Underground и многое другое","last_num":15970,"name":"WorldWide Wrestling Universe","speed":0,"threads":41,"unique_posters":26},{"bump_limit":500,"category":"Пользовательские","default_name":"Anonymous","enable_names":1,"enable_sage":1,"id":"int","info":"This board focuses on international friendship and cultural exchange.","last_num":39718,"name":"International","speed":0,"threads":401,"unique_posters":32},{"bump_limit":500,"category":"Игры","default_name":"Эрогей","enable_names":1,"enable_sage":1,"id":"ruvn","info":"","last_num":75696,"name":"Российские визуальные новеллы","speed":0,"threads":306,"unique_posters":43},{"bump_limit":0,"category":"Пользовательские","default_name":"","enable_names":0,"enable_sage":0,"id":"catalog","info":"","last_num":44,"name":"Статьи","speed":0,"threads":6,"unique_posters":6}],"global_boards":158,"global_posts":"363,061,764\u0000","global_speed":"1,335\u0000","is_index":1,"tags":[{"board":"sex","tag":"blondink"},{"board":"sex","tag":"chubby"},{"board":"sex","tag":"dadslut"},{"board":"sex","tag":"dating"},{"board":"sex","tag":"dfs"},{"board":"sex","tag":"dom"},{"board":"sex","tag":"eblan"},{"board":"sex","tag":"fairy"},{"board":"sex","tag":"faq"},{"board":"sex","tag":"frendzon"},{"board":"sex","tag":"lapute"},{"board":"sex","tag":"massage"},{"board":"sex","tag":"milf"},{"board":"sex","tag":"nofap"},{"board":"sex","tag":"penis"},{"board":"sex","tag":"sex"},{"board":"sex","tag":"shkura"},{"board":"sex","tag":"shluha"},{"board":"sex","tag":"virgin"},{"board":"sex","tag":"virt"},{"board":"sex","tag":"vyrucajt"},{"board":"vg","tag":"4x"},{"board":"vg","tag":"alg"},{"board":"vg","tag":"arma3"},{"board":"vg","tag":"art"},{"board":"vg","tag":"assassin"},{"board":"vg","tag":"avsim"},{"board":"vg","tag":"awg"},{"board":"vg","tag":"bdo"},{"board":"vg","tag":"bfg"},{"board":"vg","tag":"bioware"},{"board":"vg","tag":"blg"},{"board":"vg","tag":"bns"},{"board":"vg","tag":"catadda"},{"board":"vg","tag":"codg"},{"board":"vg","tag":"crew"},{"board":"vg","tag":"cross"},{"board":"vg","tag":"dbd"},{"board":"vg","tag":"destiny2"},{"board":"vg","tag":"diablo"},{"board":"vg","tag":"diablo2"},{"board":"vg","tag":"dos"},{"board":"vg","tag":"dota2"},{"board":"vg","tag":"dsg"},{"board":"vg","tag":"eft"},{"board":"vg","tag":"elite"},{"board":"vg","tag":"epic7"},{"board":"vg","tag":"eternal"},{"board":"vg","tag":"eveo"},{"board":"vg","tag":"factorio"},{"board":"vg","tag":"fallout"},{"board":"vg","tag":"fgoalter"},{"board":"vg","tag":"fgog"},{"board":"vg","tag":"forhonor"},{"board":"vg","tag":"games"},{"board":"vg","tag":"gd"},{"board":"vg","tag":"gerk"},{"board":"vg","tag":"gfront"},{"board":"vg","tag":"godv"},{"board":"vg","tag":"gothic"},{"board":"vg","tag":"granblue"},{"board":"vg","tag":"gta"},{"board":"vg","tag":"gw2g"},{"board":"vg","tag":"gwent"},{"board":"vg","tag":"hamlet"},{"board":"vg","tag":"honkai"},{"board":"vg","tag":"hots"},{"board":"vg","tag":"hs"},{"board":"vg","tag":"hsg"},{"board":"vg","tag":"japg"},{"board":"vg","tag":"kancolle"},{"board":"vg","tag":"kingraid"},{"board":"vg","tag":"l2c"},{"board":"vg","tag":"lisg"},{"board":"vg","tag":"lolcup"},{"board":"vg","tag":"lolg"},{"board":"vg","tag":"longdark"},{"board":"vg","tag":"lords"},{"board":"vg","tag":"love"},{"board":"vg","tag":"mhw"},{"board":"vg","tag":"mtga"},{"board":"vg","tag":"nier"},{"board":"vg","tag":"nondnd"},{"board":"vg","tag":"otwd"},{"board":"vg","tag":"ovw"},{"board":"vg","tag":"owl"},{"board":"vg","tag":"pala"},{"board":"vg","tag":"poeg"},{"board":"vg","tag":"pubg"},{"board":"vg","tag":"quake"},{"board":"vg","tag":"r6s"},{"board":"vg","tag":"rina"},{"board":"vg","tag":"ro"},{"board":"vg","tag":"sampgta"},{"board":"vg","tag":"sandbox"},{"board":"vg","tag":"sc"},{"board":"vg","tag":"scg"},{"board":"vg","tag":"simrace"},{"board":"vg","tag":"sims"},{"board":"vg","tag":"soa"},{"board":"vg","tag":"stalker"},{"board":"vg","tag":"tera"},{"board":"vg","tag":"tf2"},{"board":"vg","tag":"truck"},{"board":"vg","tag":"tw"},{"board":"vg","tag":"utg"},{"board":"vg","tag":"warframe"},{"board":"vg","tag":"wargame"},{"board":"vg","tag":"wot"},{"board":"vg","tag":"wowg"},{"board":"vg","tag":"wows"},{"board":"vg","tag":"wtg"},{"board":"vg","tag":"x3"},{"board":"mobi","tag":"2chbrows"},{"board":"mobi","tag":"advice"},{"board":"mobi","tag":"android"},{"board":"mobi","tag":"apple"},{"board":"mobi","tag":"apps"},{"board":"mobi","tag":"aquaris"},{"board":"mobi","tag":"asus"},{"board":"mobi","tag":"bb"},{"board":"mobi","tag":"dno"},{"board":"mobi","tag":"game"},{"board":"mobi","tag":"games"},{"board":"mobi","tag":"gnu"},{"board":"mobi","tag":"google"},{"board":"mobi","tag":"homescr"},{"board":"mobi","tag":"htc"},{"board":"mobi","tag":"huawei"},{"board":"mobi","tag":"java"},{"board":"mobi","tag":"lg"},{"board":"mobi","tag":"lineage"},{"board":"mobi","tag":"meizu"},{"board":"mobi","tag":"moto"},{"board":"mobi","tag":"music"},{"board":"mobi","tag":"nokia"},{"board":"mobi","tag":"notch"},{"board":"mobi","tag":"obmen"},{"board":"mobi","tag":"oneplus"},{"board":"mobi","tag":"operator"},{"board":"mobi","tag":"opsos"},{"board":"mobi","tag":"pda"},{"board":"mobi","tag":"perdole"},{"board":"mobi","tag":"photo"},{"board":"mobi","tag":"proshika"},{"board":"mobi","tag":"pubg"},{"board":"mobi","tag":"repair"},{"board":"mobi","tag":"samsung"},{"board":"mobi","tag":"screens"},{"board":"mobi","tag":"shkola"},{"board":"mobi","tag":"sony"},{"board":"mobi","tag":"sw"},{"board":"mobi","tag":"tariffs"},{"board":"mobi","tag":"treble"},{"board":"mobi","tag":"vsegovno"},{"board":"mobi","tag":"windows"},{"board":"mobi","tag":"wintable"},{"board":"mobi","tag":"wintablet"},{"board":"mobi","tag":"wtf"},{"board":"mobi","tag":"xiaomi"},{"board":"s","tag":"addons"},{"board":"s","tag":"apple"},{"board":"s","tag":"audio"},{"board":"s","tag":"bsd"},{"board":"s","tag":"chromium"},{"board":"s","tag":"desktop"},{"board":"s","tag":"fdisk"},{"board":"s","tag":"ffmpeg"},{"board":"s","tag":"fireforks"},{"board":"s","tag":"firefox"},{"board":"s","tag":"freedom"},{"board":"s","tag":"gnulinux"},{"board":"s","tag":"help"},{"board":"s","tag":"ikf"},{"board":"s","tag":"latex"},{"board":"s","tag":"lingames"},{"board":"s","tag":"linux"},{"board":"s","tag":"music"},{"board":"s","tag":"notepad"},{"board":"s","tag":"os"},{"board":"s","tag":"raindow"},{"board":"s","tag":"redhat"},{"board":"s","tag":"search"},{"board":"s","tag":"telegram"},{"board":"s","tag":"temple"},{"board":"s","tag":"ublock"},{"board":"s","tag":"vidplay"},{"board":"s","tag":"vim"},{"board":"s","tag":"virtual"},{"board":"s","tag":"vps"},{"board":"s","tag":"win10"},{"board":"s","tag":"windows"},{"board":"s","tag":"windows7"},{"board":"hw","tag":"1bitlog"},{"board":"hw","tag":"bench"},{"board":"hw","tag":"case"},{"board":"hw","tag":"chairs"},{"board":"hw","tag":"coffee"},{"board":"hw","tag":"dsd"},{"board":"hw","tag":"gamaz"},{"board":"hw","tag":"gygabite"},{"board":"hw","tag":"hueg"},{"board":"hw","tag":"insane"},{"board":"hw","tag":"keyboard"},{"board":"hw","tag":"laptop"},{"board":"hw","tag":"lowcost"},{"board":"hw","tag":"meltdown"},{"board":"hw","tag":"mikro"},{"board":"hw","tag":"monitor"},{"board":"hw","tag":"mouse"},{"board":"hw","tag":"necro"},{"board":"hw","tag":"p"},{"board":"hw","tag":"papamama"},{"board":"hw","tag":"pascal"},{"board":"hw","tag":"pasta"},{"board":"hw","tag":"pc"},{"board":"hw","tag":"psu"},{"board":"hw","tag":"ram"},{"board":"hw","tag":"repair"},{"board":"hw","tag":"retro"},{"board":"hw","tag":"ryzen"},{"board":"hw","tag":"sborkapk"},{"board":"hw","tag":"server"},{"board":"hw","tag":"thinkpad"},{"board":"hw","tag":"turing"},{"board":"hw","tag":"umpc"},{"board":"hw","tag":"vega"},{"board":"hw","tag":"vpizdu"},{"board":"hw","tag":"vr"},{"board":"hw","tag":"water"},{"board":"hw","tag":"xeon"},{"board":"mov","tag":"2001"},{"board":"mov","tag":"2049"},{"board":"mov","tag":"actress"},{"board":"mov","tag":"arthouse"},{"board":"mov","tag":"beasts"},{"board":"mov","tag":"bmovie"},{"board":"mov","tag":"chrystal"},{"board":"mov","tag":"cinema"},{"board":"mov","tag":"cliche"},{"board":"mov","tag":"critic"},{"board":"mov","tag":"doc"},{"board":"mov","tag":"dredd"},{"board":"mov","tag":"dune"},{"board":"mov","tag":"elroyale"},{"board":"mov","tag":"fails"},{"board":"mov","tag":"firstman"},{"board":"mov","tag":"h"},{"board":"mov","tag":"height"},{"board":"mov","tag":"hlwn2k18"},{"board":"mov","tag":"horror"},{"board":"mov","tag":"htd"},{"board":"mov","tag":"italy"},{"board":"mov","tag":"japan"},{"board":"mov","tag":"jumanji"},{"board":"mov","tag":"kadr"},{"board":"mov","tag":"kinopoisk"},{"board":"mov","tag":"korea"},{"board":"mov","tag":"kuvaev"},{"board":"mov","tag":"mandy"},{"board":"mov","tag":"marvel"},{"board":"mov","tag":"news"},{"board":"mov","tag":"oostrov"},{"board":"mov","tag":"outlaw"},{"board":"mov","tag":"pahom"},{"board":"mov","tag":"pok"},{"board":"mov","tag":"potter"},{"board":"mov","tag":"predator"},{"board":"mov","tag":"queen"},{"board":"mov","tag":"ready"},{"board":"mov","tag":"request"},{"board":"mov","tag":"review"},{"board":"mov","tag":"robocop"},{"board":"mov","tag":"russkoe"},{"board":"mov","tag":"star"},{"board":"mov","tag":"starwars"},{"board":"mov","tag":"theme"},{"board":"mov","tag":"torrent"},{"board":"mov","tag":"trudbog"},{"board":"mov","tag":"upgrade"},{"board":"mov","tag":"webm"},{"board":"wrk","tag":"airjb"},{"board":"wrk","tag":"asu"},{"board":"wrk","tag":"barber"},{"board":"wrk","tag":"build"},{"board":"wrk","tag":"career"},{"board":"wrk","tag":"cook"},{"board":"wrk","tag":"dno"},{"board":"wrk","tag":"finance"},{"board":"wrk","tag":"front"},{"board":"wrk","tag":"gaz"},{"board":"wrk","tag":"goodjob"},{"board":"wrk","tag":"info"},{"board":"wrk","tag":"lawtrb"},{"board":"wrk","tag":"lifevalu"},{"board":"wrk","tag":"oiljb"},{"board":"wrk","tag":"police"},{"board":"wrk","tag":"politika"},{"board":"wrk","tag":"qa"},{"board":"wrk","tag":"rabota"},{"board":"wrk","tag":"raiden"},{"board":"wrk","tag":"razvitie"},{"board":"wrk","tag":"sailor"},{"board":"wrk","tag":"svr"},{"board":"wrk","tag":"teach"},{"board":"wrk","tag":"teg"},{"board":"wrk","tag":"tlk4"},{"board":"wrk","tag":"unusual"},{"board":"wrk","tag":"webcam"},{"board":"wrk","tag":"writer"},{"board":"wrk","tag":"zen"},{"board":"wrk","tag":"айти"},{"board":"wrk","tag":"инженер"},{"board":"wrk","tag":"логисты"},{"board":"wrk","tag":"перевод"},{"board":"wrk","tag":"риелтор"},{"board":"wrk","tag":"сап"},{"board":"wrk","tag":"сми"},{"board":"wrk","tag":"чпу"},{"board":"wm","tag":"1pic"},{"board":"wm","tag":"afghan"},{"board":"wm","tag":"afv8x8"},{"board":"wm","tag":"ak"},{"board":"wm","tag":"aprounds"},{"board":"wm","tag":"armata"},{"board":"wm","tag":"army2018"},{"board":"wm","tag":"contr"},{"board":"wm","tag":"coolstry"},{"board":"wm","tag":"cosmos"},{"board":"wm","tag":"df-21"},{"board":"wm","tag":"flogger"},{"board":"wm","tag":"kbomsk"},{"board":"wm","tag":"kino"},{"board":"wm","tag":"likbez"},{"board":"wm","tag":"lulz"},{"board":"wm","tag":"manyawar"},{"board":"wm","tag":"new"},{"board":"wm","tag":"nnaddr"},{"board":"wm","tag":"pvo"},{"board":"wm","tag":"ratnik"},{"board":"wm","tag":"retro"},{"board":"wm","tag":"soon"},{"board":"wm","tag":"style"},{"board":"wm","tag":"syriawm"},{"board":"wm","tag":"tank"},{"board":"wm","tag":"tiger4x4"},{"board":"wm","tag":"tracked"},{"board":"wm","tag":"ukrvpk"},{"board":"wm","tag":"webm"},{"board":"wm","tag":"wmnews"},{"board":"wm","tag":"wmvg"},{"board":"wm","tag":"yemenwm"},{"board":"wm","tag":"zapad"},{"board":"wm","tag":"zhuhai"},{"board":"bi","tag":"croc"},{"board":"bi","tag":"fat"},{"board":"bi","tag":"folding"},{"board":"bi","tag":"gravel"},{"board":"bi","tag":"mtb"},{"board":"bi","tag":"saddle"},{"board":"bi","tag":"tire"},{"board":"bi","tag":"travel"},{"board":"bi","tag":"uni"},{"board":"bi","tag":"запил"},{"board":"bi","tag":"нищевел"},{"board":"bi","tag":"фикс"},{"board":"bi","tag":"шоссер"},{"board":"bi","tag":"электро"},{"board":"pr","tag":"1c"},{"board":"pr","tag":"ai"},{"board":"pr","tag":"algrthm"},{"board":"pr","tag":"android"},{"board":"pr","tag":"asm"},{"board":"pr","tag":"b"},{"board":"pr","tag":"belit"},{"board":"pr","tag":"clang"},{"board":"pr","tag":"clojure"},{"board":"pr","tag":"compsci"},{"board":"pr","tag":"cpp"},{"board":"pr","tag":"csharp"},{"board":"pr","tag":"dlang"},{"board":"pr","tag":"forth"},{"board":"pr","tag":"fros"},{"board":"pr","tag":"fun"},{"board":"pr","tag":"gamedev"},{"board":"pr","tag":"go"},{"board":"pr","tag":"ideas"},{"board":"pr","tag":"incoming"},{"board":"pr","tag":"ios"},{"board":"pr","tag":"java"},{"board":"pr","tag":"js"},{"board":"pr","tag":"lisp"},{"board":"pr","tag":"nevkatil"},{"board":"pr","tag":"nim"},{"board":"pr","tag":"ocaml"},{"board":"pr","tag":"pascal"},{"board":"pr","tag":"php"},{"board":"pr","tag":"plus"},{"board":"pr","tag":"python"},{"board":"pr","tag":"qa"},{"board":"pr","tag":"remote"},{"board":"pr","tag":"ruby"},{"board":"pr","tag":"rust"},{"board":"pr","tag":"scala"},{"board":"pr","tag":"sicp"},{"board":"pr","tag":"sql"},{"board":"pr","tag":"stegano"},{"board":"pr","tag":"talks"},{"board":"pr","tag":"ts-govno"},{"board":"pr","tag":"ukrgd"},{"board":"pr","tag":"vcs"},{"board":"pr","tag":"xo"},{"board":"tv","tag":"affair"},{"board":"tv","tag":"agents"},{"board":"tv","tag":"american"},{"board":"tv","tag":"arest"},{"board":"tv","tag":"arrow"},{"board":"tv","tag":"bcs"},{"board":"tv","tag":"becasa"},{"board":"tv","tag":"channel"},{"board":"tv","tag":"cobra"},{"board":"tv","tag":"cwverse"},{"board":"tv","tag":"deuce"},{"board":"tv","tag":"flash"},{"board":"tv","tag":"friends"},{"board":"tv","tag":"future"},{"board":"tv","tag":"gifted"},{"board":"tv","tag":"goodomen"},{"board":"tv","tag":"gotham"},{"board":"tv","tag":"hmcmng"},{"board":"tv","tag":"impulse"},{"board":"tv","tag":"killjoys"},{"board":"tv","tag":"legends"},{"board":"tv","tag":"legion"},{"board":"tv","tag":"magicns"},{"board":"tv","tag":"marvel"},{"board":"tv","tag":"mayansmc"},{"board":"tv","tag":"mazhor"},{"board":"tv","tag":"mercedes"},{"board":"tv","tag":"mrrobot"},{"board":"tv","tag":"origin"},{"board":"tv","tag":"outlanda"},{"board":"tv","tag":"outpost"},{"board":"tv","tag":"ozark"},{"board":"tv","tag":"patriot"},{"board":"tv","tag":"preacher"},{"board":"tv","tag":"request"},{"board":"tv","tag":"review"},{"board":"tv","tag":"rikimort"},{"board":"tv","tag":"rim"},{"board":"tv","tag":"rivrdale"},{"board":"tv","tag":"russian"},{"board":"tv","tag":"s-valley"},{"board":"tv","tag":"sabrina"},{"board":"tv","tag":"scrubs"},{"board":"tv","tag":"serial"},{"board":"tv","tag":"shame"},{"board":"tv","tag":"southpar"},{"board":"tv","tag":"sp"},{"board":"tv","tag":"space"},{"board":"tv","tag":"spn"},{"board":"tv","tag":"stargate"},{"board":"tv","tag":"startrek"},{"board":"tv","tag":"stranger"},{"board":"tv","tag":"sunny"},{"board":"tv","tag":"supergrl"},{"board":"tv","tag":"terror"},{"board":"tv","tag":"the100"},{"board":"tv","tag":"thevoice"},{"board":"tv","tag":"thrones"},{"board":"tv","tag":"titans"},{"board":"tv","tag":"totdy"},{"board":"tv","tag":"twd"},{"board":"tv","tag":"vikings"},{"board":"tv","tag":"webm"},{"board":"tv","tag":"westwrld"},{"board":"tv","tag":"who"},{"board":"tv","tag":"witcher"},{"board":"tv","tag":"znation"},{"board":"fg","tag":"ass"},{"board":"fg","tag":"belarus"},{"board":"fg","tag":"camwhore"},{"board":"fg","tag":"chances"},{"board":"fg","tag":"cross"},{"board":"fg","tag":"cure"},{"board":"fg","tag":"dates"},{"board":"fg","tag":"deflorac"},{"board":"fg","tag":"eskort"},{"board":"fg","tag":"fap"},{"board":"fg","tag":"faq"},{"board":"fg","tag":"farm"},{"board":"fg","tag":"ftm"},{"board":"fg","tag":"jill"},{"board":"fg","tag":"law"},{"board":"fg","tag":"request"},{"board":"fg","tag":"sissy"},{"board":"fg","tag":"story"},{"board":"fg","tag":"trap"},{"board":"fg","tag":"tumeny"},{"board":"fg","tag":"virt"},{"board":"hry","tag":"alexdarkstalker"},{"board":"hry","tag":"dimurich"},{"board":"hry","tag":"doka2"},{"board":"hry","tag":"ebg"},{"board":"hry","tag":"fedorov"},{"board":"hry","tag":"gamaz"},{"board":"hry","tag":"ghitelman"},{"board":"hry","tag":"hach"},{"board":"hry","tag":"honeymad"},{"board":"hry","tag":"hova"},{"board":"hry","tag":"hrysndi"},{"board":"hry","tag":"itpedia"},{"board":"hry","tag":"kamikadze"},{"board":"hry","tag":"komander"},{"board":"hry","tag":"kravchen"},{"board":"hry","tag":"kuvaev"},{"board":"hry","tag":"logvinov"},{"board":"hry","tag":"maestro"},{"board":"hry","tag":"md"},{"board":"hry","tag":"navalny"},{"board":"hry","tag":"nestor"},{"board":"hry","tag":"nevzorov"},{"board":"hry","tag":"om"},{"board":"hry","tag":"papich"},{"board":"hry","tag":"parfyonov"},{"board":"hry","tag":"ra"},{"board":"hry","tag":"rasstrig"},{"board":"hry","tag":"rog"},{"board":"hry","tag":"ruslan"},{"board":"hry","tag":"russiantv"},{"board":"hry","tag":"sharii"},{"board":"hry","tag":"smash"},{"board":"hry","tag":"sobolev"},{"board":"hry","tag":"stalik"},{"board":"hry","tag":"svetov"},{"board":"hry","tag":"tobeor"},{"board":"hry","tag":"uber"},{"board":"hry","tag":"ugodai"},{"board":"hry","tag":"valeron"},{"board":"hry","tag":"vanomas"},{"board":"hry","tag":"vdud"},{"board":"hry","tag":"vnuk"},{"board":"hry","tag":"wylsacom"},{"board":"hry","tag":"youtube"},{"board":"hry","tag":"zaebisy"},{"board":"mlp","tag":"applejack"},{"board":"mlp","tag":"appljack"},{"board":"mlp","tag":"bro"},{"board":"mlp","tag":"celestia"},{"board":"mlp","tag":"deth"},{"board":"mlp","tag":"discuss"},{"board":"mlp","tag":"fanfic"},{"board":"mlp","tag":"foe"},{"board":"mlp","tag":"game"},{"board":"mlp","tag":"general"},{"board":"mlp","tag":"kirin"},{"board":"mlp","tag":"mlp"},{"board":"mlp","tag":"pa"},{"board":"mlp","tag":"q"},{"board":"mlp","tag":"r-34"},{"board":"mlp","tag":"rd"},{"board":"mlp","tag":"roll"},{"board":"mlp","tag":"wut"},{"board":"fs","tag":"#films"},{"board":"fs","tag":"armament"},{"board":"fs","tag":"bakker"},{"board":"fs","tag":"bestgirl"},{"board":"fs","tag":"bestiary"},{"board":"fs","tag":"bright"},{"board":"fs","tag":"butthurt"},{"board":"fs","tag":"cosmere"},{"board":"fs","tag":"darksoul"},{"board":"fs","tag":"darkwar"},{"board":"fs","tag":"demons"},{"board":"fs","tag":"dl"},{"board":"fs","tag":"dniwe"},{"board":"fs","tag":"dresden"},{"board":"fs","tag":"dwarfs"},{"board":"fs","tag":"expects"},{"board":"fs","tag":"fantasti"},{"board":"fs","tag":"femwar"},{"board":"fs","tag":"gcook"},{"board":"fs","tag":"gear"},{"board":"fs","tag":"gerk"},{"board":"fs","tag":"gods"},{"board":"fs","tag":"kingkill"},{"board":"fs","tag":"litrpg"},{"board":"fs","tag":"lotr"},{"board":"fs","tag":"lovcraft"},{"board":"fs","tag":"magic"},{"board":"fs","tag":"malazan"},{"board":"fs","tag":"manyamir"},{"board":"fs","tag":"mongirl"},{"board":"fs","tag":"moorcock"},{"board":"fs","tag":"orcs"},{"board":"fs","tag":"pehov"},{"board":"fs","tag":"perumov"},{"board":"fs","tag":"potter"},{"board":"fs","tag":"race"},{"board":"fs","tag":"reaction"},{"board":"fs","tag":"request"},{"board":"fs","tag":"rusfs"},{"board":"fs","tag":"si"},{"board":"fs","tag":"succubus"},{"board":"fs","tag":"twot"},{"board":"fs","tag":"undead"},{"board":"fs","tag":"warcraft"},{"board":"fs","tag":"witcher"},{"board":"fs","tag":"worm"},{"board":"mo","tag":"2t"},{"board":"mo","tag":"begin"},{"board":"mo","tag":"best"},{"board":"mo","tag":"brz"},{"board":"mo","tag":"china"},{"board":"mo","tag":"cruiser"},{"board":"mo","tag":"dc2moto"},{"board":"mo","tag":"doc"},{"board":"mo","tag":"ezd"},{"board":"mo","tag":"gp"},{"board":"mo","tag":"honda"},{"board":"mo","tag":"hrd"},{"board":"mo","tag":"ktm"},{"board":"mo","tag":"kvadr"},{"board":"mo","tag":"mini"},{"board":"mo","tag":"mtube"},{"board":"mo","tag":"oil"},{"board":"mo","tag":"old"},{"board":"mo","tag":"pit"},{"board":"mo","tag":"please"},{"board":"mo","tag":"prt"},{"board":"mo","tag":"rem"},{"board":"mo","tag":"scoot"},{"board":"mo","tag":"sport"},{"board":"mo","tag":"stant"},{"board":"mo","tag":"trend"},{"board":"mo","tag":"usach"},{"board":"mo","tag":"wolves"},{"board":"mo","tag":"youmoto"},{"board":"mo","tag":"zap"},{"board":"mo","tag":"дальняк"},{"board":"mo","tag":"права"},{"board":"mo","tag":"резина"},{"board":"mo","tag":"скрем"},{"board":"mo","tag":"цепь"},{"board":"mo","tag":"экип"},{"board":"vape","tag":"genesis"},{"board":"vape","tag":"ku"},{"board":"vape","tag":"milkman"},{"board":"vape","tag":"mtl"},{"board":"vape","tag":"pod"},{"board":"vape","tag":"podliva"},{"board":"vape","tag":"posovetu"},{"board":"vape","tag":"repair"},{"board":"vape","tag":"request"},{"board":"vape","tag":"tesla"},{"board":"vape","tag":"vape"},{"board":"vape","tag":"vapetags"},{"board":"vape","tag":"vaporize"},{"board":"vape","tag":"vybor"},{"board":"vape","tag":"zhizhka"},{"board":"fl","tag":"ain"},{"board":"fl","tag":"arab"},{"board":"fl","tag":"armyan"},{"board":"fl","tag":"ass"},{"board":"fl","tag":"austria"},{"board":"fl","tag":"baltica"},{"board":"fl","tag":"brezh"},{"board":"fl","tag":"bul"},{"board":"fl","tag":"deu"},{"board":"fl","tag":"dt"},{"board":"fl","tag":"eng"},{"board":"fl","tag":"french"},{"board":"fl","tag":"general"},{"board":"fl","tag":"geokat"},{"board":"fl","tag":"got"},{"board":"fl","tag":"grcell"},{"board":"fl","tag":"grcold"},{"board":"fl","tag":"himotogo"},{"board":"fl","tag":"hindi"},{"board":"fl","tag":"hun"},{"board":"fl","tag":"jippongo"},{"board":"fl","tag":"keyboard"},{"board":"fl","tag":"nihongo"},{"board":"fl","tag":"nippongo"},{"board":"fl","tag":"nld"},{"board":"fl","tag":"ohowago"},{"board":"fl","tag":"rus"},{"board":"fl","tag":"sign"},{"board":"fl","tag":"spain"},{"board":"fl","tag":"tamago"},{"board":"fl","tag":"tutor"},{"board":"fl","tag":"ukr"},{"board":"fl","tag":"viet"},{"board":"fl","tag":"vyapro"},{"board":"fl","tag":"wales"},{"board":"fl","tag":"yasimago"},{"board":"fl","tag":"zhongwen"},{"board":"fur","tag":"ancient"},{"board":"fur","tag":"animat"},{"board":"fur","tag":"archaic"},{"board":"fur","tag":"avian"},{"board":"fur","tag":"bdsm"},{"board":"fur","tag":"breeding"},{"board":"fur","tag":"butthurt"},{"board":"fur","tag":"cartoons"},{"board":"fur","tag":"clean"},{"board":"fur","tag":"comics"},{"board":"fur","tag":"coyote"},{"board":"fur","tag":"cute"},{"board":"fur","tag":"dates"},{"board":"fur","tag":"dog"},{"board":"fur","tag":"dragon"},{"board":"fur","tag":"fap"},{"board":"fur","tag":"female"},{"board":"fur","tag":"feral"},{"board":"fur","tag":"fetish"},{"board":"fur","tag":"finisher"},{"board":"fur","tag":"fun"},{"board":"fur","tag":"furtoys"},{"board":"fur","tag":"games"},{"board":"fur","tag":"humans"},{"board":"fur","tag":"hyena"},{"board":"fur","tag":"joy"},{"board":"fur","tag":"luna7"},{"board":"fur","tag":"male"},{"board":"fur","tag":"mrrshan"},{"board":"fur","tag":"oc"},{"board":"fur","tag":"orgy"},{"board":"fur","tag":"rape"},{"board":"fur","tag":"redpanda"},{"board":"fur","tag":"request"},{"board":"fur","tag":"rimming"},{"board":"fur","tag":"risovach"},{"board":"fur","tag":"scat"},{"board":"fur","tag":"science"},{"board":"fur","tag":"sharks"},{"board":"fur","tag":"snake"},{"board":"fur","tag":"snow"},{"board":"fur","tag":"sobacka"},{"board":"fur","tag":"story"},{"board":"fur","tag":"straight"},{"board":"fur","tag":"taur"},{"board":"fur","tag":"tmnt"},{"board":"fur","tag":"truetail"},{"board":"sw","tag":"chewbacc"},{"board":"sw","tag":"clones"},{"board":"sw","tag":"comics"},{"board":"sw","tag":"council"},{"board":"sw","tag":"empire"},{"board":"sw","tag":"episode7"},{"board":"sw","tag":"giperput"},{"board":"sw","tag":"kotor"},{"board":"sw","tag":"legosw"},{"board":"sw","tag":"rebels"},{"board":"sw","tag":"reviews"},{"board":"sw","tag":"rogueone"},{"board":"sw","tag":"rustrans"},{"board":"sw","tag":"solo"},{"board":"sw","tag":"sosa4cup"},{"board":"sw","tag":"swbfront"},{"board":"sw","tag":"swgames"},{"board":"sw","tag":"swmarvel"},{"board":"sw","tag":"swmb"},{"board":"sw","tag":"swmuz"},{"board":"sw","tag":"swrviews"},{"board":"sw","tag":"swseqtr"},{"board":"sw","tag":"swshow"},{"board":"sw","tag":"swtor"},{"board":"sw","tag":"swvswh"},{"board":"sw","tag":"zadroter"},{"board":"crypt","tag":"android"},{"board":"crypt","tag":"bitcoin"},{"board":"crypt","tag":"blobs"},{"board":"crypt","tag":"cloud"},{"board":"crypt","tag":"faq"},{"board":"crypt","tag":"glonass"},{"board":"crypt","tag":"history"},{"board":"crypt","tag":"i2p"},{"board":"crypt","tag":"im"},{"board":"crypt","tag":"kvest"},{"board":"crypt","tag":"masssurv"},{"board":"crypt","tag":"news"},{"board":"crypt","tag":"paranoia"},{"board":"crypt","tag":"pgp"},{"board":"crypt","tag":"pwds"},{"board":"crypt","tag":"request"},{"board":"crypt","tag":"rozhkov"},{"board":"crypt","tag":"rshare"},{"board":"crypt","tag":"stegano"},{"board":"crypt","tag":"telegram"},{"board":"crypt","tag":"tox"},{"board":"crypt","tag":"tvcrypt"},{"board":"crypt","tag":"wi-fi"},{"board":"kpop","tag":"aoa"},{"board":"kpop","tag":"archive"},{"board":"kpop","tag":"dc"},{"board":"kpop","tag":"gugudan"},{"board":"kpop","tag":"hallyu2"},{"board":"kpop","tag":"jyp"},{"board":"kpop","tag":"omg"},{"board":"kpop","tag":"pantheon"},{"board":"kpop","tag":"rv"},{"board":"kpop","tag":"sm"},{"board":"kpop","tag":"twice"},{"board":"kpop","tag":"victoria"},{"board":"kpop","tag":"webm"},{"board":"kpop","tag":"wg"}],"type":0}
		} else {
			response = await http.get('2ch://boards.json')
		}
		// const response = await http.get('2ch://boards.json')
		const boards = response.boards.map((board) => ({
			category: board.category,
			id: board.id,
			name: board.name,
			description: board.info,
			postsPerHour: board.speed
		}))
		const boardsBySpeed = boards //.slice().sort((a, b) => b.speed - a.speed)
		const boardsByCategory = boards.reduce((categories, board) => {
			let category = categories.filter(_ => _.category === board.category)[0]
			if (!category) {
				category = {
					category: board.category,
					boards: []
				}
				categories.push(category)
			}
			category.boards.push({
				id: board.id,
				name: board.name,
				info: board.info,
				speed: board.speed
			})
			return categories
		}, [])
		return {
			boardsBySpeed,
			boardsByCategory
		}
	},
	(state, result) => ({
		...state,
		...result
	})
)

export const selectBoard = redux.simpleAction(
	(id) => id,
	(state, id) => ({
		...state,
		board: state.boardsBySpeed.find(_ => _.id === id)
	})
)

export const getThreads = redux.action(
	(board, page = 1) => async http => {
		const response = await http.get(`2ch://${board}/${page}.json`)
		const pages = response.pages.length - 1
		const threads = response.threads.map((thread) => {
			const post = thread.posts[0]
			const id = String(post.num)
			const author = parseAuthor(post.name, response.default_name)
			if (!filterComment(post.comment)) {
				return
			}
			if (post.subject) {
				// Detect `subject` being autogenerated from `comment`.
				// If the `subject` is autogenerated then ignore it.
				if (isAutogeneratedSubject(post.subject, post.comment)) {
					post.subject = null
				}
			}
			// Sometimes users skip the subject field and
			// write the subject in bold as part of the post.
			if (post.comment && !post.subject) {
				const match = parseSubjectFromComment(post.comment)
				if (match) {
					post.subject = match.subject
					post.comment = match.comment
					// If the post subject is all caps then convert it to normal case.
					if (!/[а-я]/.test(post.subject) && /[А-Я]/.test(post.subject)) {
						post.subject = post.subject.toLowerCase()
						post.subject = post.subject.replace(/([а-я])/, _ => _.toUpperCase())
					}
				}
			}
			return {
				id,
				board: response.Board,
				commentsCount: thread.posts_count,
				author,
				subject: post.subject ? correctGrammar(unescapeContent(post.subject)) : undefined,
				openingPost: {
					id,
					author,
					role: post.trip === '!!%adm%!!' ? 'administrator' : post.trip === '!!%mod%!!' ? 'moderator' : undefined,
					content: post.comment ? parseComment(post.comment, false) : undefined,
					inReplyTo: post.comment ? getInReplyToPosts(post.comment) : undefined,
					attachments: post.files.map(parseAttachment).map((attachment, i) => ({ id: i, ...attachment })),
					createdAt: new Date(post.timestamp * 1000),
					isClosed: post.closed === 1,
					isEndless: post.endless === 1,
					isSticky: post.sticky === 1
				}
			}
		}).filter(_ => _)
		return {
			threads,
			threadsPage: page,
			threadsPages: pages
		}
	},
	(state, result) => ({
		...state,
		...result
	})
)

export default redux.reducer()

function parseAuthor(name, defaultName) {
	// `Аноним`
	// `Аноним&nbsp;ID:&nbsp;<span id=\"id_tag_7ab0a33a\" style=\"color:rgb(116,48,218);\">Насмешливый&nbsp;Обеликс</span>`
	// `mailto:sage`
	// `mailto:user@domain.com`
	if (name === defaultName ||
		name.indexOf('ID:&nbsp;') >= 0 ||
		name === 'mailto:sage') {
		return
	}
	return name.replace(/mailto:/, '')
}

// Detect `subject` being autogenerated from `comment`.
function isAutogeneratedSubject(subject, comment) {
	// This is how `2ch.hk` autogenerates post subjects from content.
	const autogeneratedSubject = comment.replace(/<br>/g, ' ').replace(/<.+?>/g, '')
	return autogeneratedSubject.indexOf(subject) === 0
}

function parseAttachment(file) {
	const contentType = getContentTypeByFileType(file.type)
	if (contentType && contentType.indexOf('image/') === 0) {
		return {
			type: 'picture',
			size: file.size, // in kilobytes
			picture: {
				type: contentType,
				sizes: [{
					width: file.tn_width,
					height: file.tn_height,
					url: `https://2ch.hk${file.thumbnail}`
				}, {
					width: file.width,
					height: file.height,
					url: `https://2ch.hk${file.path}`
				}]
			}
		}
	}
	if (contentType && contentType.indexOf('video/') === 0) {
		const pictureContentType = getContentTypeByFileName(file.thumbnail)
		let picture
		if (pictureContentType) {
			picture = {
				type: pictureContentType,
				sizes: [{
					width: file.tn_width,
					height: file.tn_height,
					url: `https://2ch.hk${file.thumbnail}`
				}]
			}
		} else {
			console.error(`Unknown video picture file type: ${JSON.stringify(file)}`)
			picture = TRANSPARENT_PIXEL
		}
		return {
			type: 'video',
			size: file.size, // in kilobytes
			video: {
				type: contentType,
				duration: file.duration_secs,
				width: file.width,
				height: file.height,
				source: {
					provider: 'file',
					sizes: [{
						width: file.width,
						height: file.height,
						url: `https://2ch.hk${file.path}`
					}]
				},
				picture
			}
		}
	}
	console.error(`Unknown file type: ${JSON.stringify(file)}`)
	return TRANSPARENT_PIXEL
}

function getContentTypeByFileType(type) {
	switch (type) {
		case 1:
			return 'image/jpeg'
		case 2:
			return 'image/png'
		case 4:
			return 'image/gif'
		case 6:
			return 'video/webm'
		case 10:
			return 'video/mp4'
		// Stickers.
		case 100:
			return 'image/png'
	}
}

const JPG_FILE_NAME = /\.jpg$/
const PNG_FILE_NAME = /\.png$/
const GIF_FILE_NAME = /\.gif$/

function getContentTypeByFileName(fileName) {
	if (JPG_FILE_NAME.test(fileName)) {
		return 'image/jpeg'
	}
	if (PNG_FILE_NAME.test(fileName)) {
		return 'image/png'
	}
	if (GIF_FILE_NAME.test(fileName)) {
		return 'image/gif'
	}
}

// const ERROR_PICTURE = {
// 	type: 'image/svg+xml',
// 	sizes: [{
// 		width: 512,
// 		height: 512,
// 		url: 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUxMiA1MTIiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiB4bWw6c3BhY2U9InByZXNlcnZlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48bGluZWFyR3JhZGllbnQgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJTVkdJRF8xXyIgeDE9IjI1NiIgeDI9IjI1NiIgeTE9IjUxMiIgeTI9Ii05LjA5NDk0N2UtMDEzIj48c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiNFNzM4MjciLz48c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiNGODUwMzIiLz48L2xpbmVhckdyYWRpZW50PjxjaXJjbGUgY3g9IjI1NiIgY3k9IjI1NiIgZmlsbD0idXJsKCNTVkdJRF8xXykiIHI9IjI1NiIvPjxwYXRoIGQ9Ik0yNjguNywyNTZsMTE5LjYtMTE5LjZjMy4yLTMuMiwzLjItOC4zLDAtMTEuNGMtMy4yLTMuMi04LjMtMy4yLTExLjQsMEwyNTcuMiwyNDQuNkwxMzUuMSwxMjIuNSAgYy0zLjItMy4yLTguMy0zLjItMTEuNCwwYy0zLjIsMy4yLTMuMiw4LjMsMCwxMS40TDI0NS44LDI1NkwxMjMuNywzNzguMWMtMy4yLDMuMi0zLjIsOC4zLDAsMTEuNGMxLjYsMS42LDMuNywyLjQsNS43LDIuNCAgYzIuMSwwLDQuMS0wLjgsNS43LTIuNGwxMjIuMS0xMjIuMWwxMTkuNiwxMTkuNmMxLjYsMS42LDMuNywyLjQsNS43LDIuNGMyLjEsMCw0LjEtMC44LDUuNy0yLjRjMy4yLTMuMiwzLjItOC4zLDAtMTEuNEwyNjguNywyNTZ6IiBmaWxsPSIjRkZGRkZGIi8+PC9zdmc+'
// 	}]
// }

const TRANSPARENT_PIXEL = {
	type: 'image/png',
	sizes: [{
		width: 1,
		height: 1,
		url: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='
	}]
}

// Returns an array of paragraphs.
function parseComment(comment, parseParagraphs = true) {
	// // Replace inline quotes with block quotes.
	// // Converts `abc<br><span class="unkfunc">> ccc</span><br>def`
	// // to `abc<div class="quote">ccc</div>def`.
	// comment = comment.replace(
	// 	/(?:<br>)?<span class="unkfunc">&gt;\s*(.*?)<\/span>(?:<br>)?/g,
	// 	'<div class="quote">$1</div>'
	// )
	// Parse into paragraphs.
	if (parseParagraphs) {
		const paragraphs = comment.split(/<br>(?:<br>)+/)
		return paragraphs.filter(_ => _).map(parseParagraph)
	}
	// Remove excessive `<br>`s.
	comment = comment
		.replace(/<br>(<br>)+/g, '<br><br>')
		.replace(/^<br>(<br>)?/, '')
		.replace(/<br>(<br>)?$/, '')
	return [parseParagraph(comment)]
}

// Returns an array of inline elements.
// Some of such inline elements may be empty strings
// which are later filtered by `parseComment()`.
function parseParagraph(text) {
	// Normalize `<br>`s so that they don't break parsing (`findClosingTagPosition()`).
	text = text.replace(/<br>/g, '<br/>')
	// text = removeInvalidClosingTags(text)
	for (const plugin of PARSE_COMMENT_TEXT_PLUGINS) {
		const parsed = plugin(text)
		if (parsed) {
			return parsed.filter(_ => _)
			// if (Array.isArray(parsed)) {
			// 	return parsed.filter(_ => _)
			// }
			// // Invalid HTML markup was corrected.
			// return parseParagraph(parsed)
		}
	}
	// Generic text.
	return [correctGrammar(unescapeContent(text))]
}

function removeInvalidClosingTags(text) {
	const firstTagStartsAt = text.indexOf('<')
	if (text[firstTagStartsAt + 1] === '/') {
		const firstTagEndsAt = text.indexOf('>', firstTagStartsAt)
		return removeInvalidClosingTags(text.slice(firstTagEndsAt >= 0 ? firstTagEndsAt + 1 : firstTagStartsAt + 1))
	}
	return text
}

const PARSE_COMMENT_TEXT_PLUGINS = [
	parseNewLine,
	parseInlineQuote,
	parseQuote,
	parseLink,
	parseBold,
	parseItalic,
	parseStrikethrough,
	parseUnderline,
	parseOverline,
	parseColoredText,
	parseSpoiler,
	parseSubscript,
	parseSuperscript
]

function parseHtmlTag(text, { opener, attributes, canContainChildren, correctContent, createBlock }) {
	const firstTagStartsAt = text.indexOf('<')
	if (firstTagStartsAt < 0) {
		return
	}
	// First parse outer tags, then inner tags.
	if (text.indexOf('<' + opener) !== firstTagStartsAt) {
		return
	}
	const startsAt = text.indexOf('<' + opener)
	if (startsAt >= 0) {
		const openerEndsAt = text.indexOf('>', startsAt + '<'.length)
		// Parse content.
		let endsAt
		let content
		if (canContainChildren !== false) {
			const contentStartsAt = text.indexOf('>', startsAt + 1) + '>'.length
			const contentEndsAt = findClosingTagPosition(text, contentStartsAt)
			// Invalid HTML markup.
			// Remove the invalid HTML tag.
			if (!contentEndsAt) {
				// return text.slice(contentStartsAt)
				console.error('Invalid HTML markup', text)
				return
			}
			endsAt = text.indexOf('>', contentEndsAt) + '>'.length
			content = text.slice(contentStartsAt, contentEndsAt)
			// If there are nested tags then maybe parse them.
			if (content.indexOf('<') >= 0) {
				content = parseParagraph(content)
			} else {
				content = correctContent === false ? unescapeContent(content) : correctGrammar(unescapeContent(content))
			}
		} else {
			endsAt = text.indexOf('>', startsAt) + '>'.length
		}
		// Parse attributes.
		const _attributes = []
		if (attributes) {
			const markup = text.slice(startsAt, openerEndsAt)
			for (const attribute of attributes) {
				const attributeDefinitionStartsAt = markup.indexOf(`${attribute}="`, startsAt + 1)
				if (attributeDefinitionStartsAt < 0) {
					_attributes.push()
					continue
				}
				const attributeStartsAt = attributeDefinitionStartsAt + `${attribute}="`.length
				const attributeEndsAt = markup.indexOf('"', attributeStartsAt)
				_attributes.push(
					unescapeContent(
						markup.slice(attributeStartsAt, attributeEndsAt)
					)
				)
			}
		}
		return [].concat(
			parseParagraph(text.slice(0, startsAt)),
			createBlock(content, _attributes),
			parseParagraph(text.slice(endsAt))
		)
	}
}

function parseNewLine(text) {
	return parseHtmlTag(text, {
		opener: 'br/>',
		canContainChildren: false,
		createBlock() {
			return '\n'
		}
	})
}

function parseInlineQuote(text) {
	return parseHtmlTag(text, {
		opener: 'span class="unkfunc">',
		createBlock(content) {
			// `> abc` -> `abc`
			if (typeof content === 'string') {
				content = content.replace(/^>\s*/, '')
			} else {
				content[0] = content[0].replace(/^>\s*/, '')
			}
			return {
				type: 'quote',
				content
			}
		}
	})
}

function parseQuote(text) {
	return parseHtmlTag(text, {
		opener: 'div class="quote">',
		createBlock(content) {
			return {
				type: 'quote',
				content
			}
		}
	})
}

function parseBold(text) {
	return parseHtmlTag(text, {
		opener: 'strong',
		createBlock(content) {
			return {
				type: 'text',
				style: 'bold',
				content
			}
		}
	})
}

function parseItalic(text) {
	return parseHtmlTag(text, {
		opener: 'em',
		createBlock(content) {
			return {
				type: 'text',
				style: 'italic',
				content
			}
		}
	})
}

function parseSubscript(text) {
	return parseHtmlTag(text, {
		opener: 'sub',
		createBlock(content) {
			return {
				type: 'text',
				style: 'subscript',
				content
			}
		}
	})
}

function parseSuperscript(text) {
	return parseHtmlTag(text, {
		opener: 'sup',
		createBlock(content) {
			return {
				type: 'text',
				style: 'superscript',
				content
			}
		}
	})
}

function parseStrikethrough(text) {
	return parseHtmlTag(text, {
		opener: 'span class="s"',
		createBlock(content) {
			return {
				type: 'text',
				style: 'strikethrough',
				content
			}
		}
	})
}

function parseSpoiler(text) {
	return parseHtmlTag(text, {
		opener: 'span class="spoiler"',
		createBlock(content) {
			return {
				type: 'spoiler',
				content
			}
		}
	})
}

function parseUnderline(text) {
	return parseHtmlTag(text, {
		opener: 'span class="u"',
		createBlock(content) {
			return content
		}
	})
}

function parseOverline(text) {
	return parseHtmlTag(text, {
		opener: 'span class="o"',
		createBlock(content) {
			return content
		}
	})
}

function parseLink(text) {
	return parseHtmlTag(text, {
		opener: 'a ',
		attributes: ['href', 'data-thread', 'data-num'],
		correctContent: false,
		createBlock(content, [href, threadId, postId]) {
			if (threadId) {
				return {
					type: 'post-link',
					threadId,
					postId,
					content: content.slice('>>'.length),
					url: `https://2ch.hk${href}`
				}
			}
			return {
				type: 'link',
				content: getHumanReadableLinkAddress(content),
				url: href
			}
		}
	})
}

function parseColoredText(text) {
	return parseHtmlTag(text, {
		opener: 'span style="color:',
		createBlock(content) {
			return content
		}
	})
}

function unescapeContent(string) {
	return string
		.replace(/&quot;/g, '"')
		.replace(/&amp;/g, '&')
		.replace(/&gt;/g, '>')
		.replace(/&lt;/g, '<')
		// .replace(/&#39;/g, '\'')
		// .replace(/&#47;/g, '/')
		// .replace(/&#92;/g, '\\')
		.replace(/&#([0-9]{1,3});/gi, (match, code) => String.fromCharCode(parseInt(code, 10)))
}

function getHumanReadableLinkAddress(content) {
	return content
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www.)?/, '')
		// Remove `/` in the end.
		.replace(/\/$/, '')
}

function correctGrammar(text) {
	return text
		// ` -- ` -> ` — ` (converts double dash to long dash)
		.replace(/\s+--\s+/g, ' — ')
		// ` - ` -> ` — ` (converts dash to long dash)
		.replace(/\s+-\s+/g, ' — ')
		// Some people write lists using dashes so turned off this grammar correction rule.
		// // ` - ` -> ` — ` (converts a dash in the beginning of a string to a long dash)
		// .replace(/\n-\s+/g, '\n— ')
		// .replace(/^-\s+/g, '— ')
		// `a- ` -> `a — ` (converts a dash to long dash and adds space)
		.replace(/([а-я])-\s+/g, '$1 — ')
		// `a(a` -> `a (a` (adds a space before an opening parenthesis,
		//                  removes a space after an opening parenthesis)
		.replace(/([а-я]["\.!?]?) ?\( ?([\dа-я])/g, '$1 ($2')
		// `a(a` -> `a (a` (adds a space after a closing parenthesis)
		.replace(/([\dа-я][\."]?)\)([а-я])/g, '$1) $2')
		// `a:a` -> `a: a` (adds a space after a colon)
		.replace(/([а-я]):([\dа-я])/g, '$1: $2')
		// `\n.A` -> `\nА` (removes a comma in the start)
		.replace(/^\.([А-Я])/g, '$1')
		// `one ,two` -> `one,two`
		// `one , two` -> `one, two`
		.replace(/\s+,/g, ',')
		// `one,two` -> `one, two`
		.replace(/,(\S)/g, ', $1')
		// `one ?` -> `one?`
		.replace(/\s+([\.!?])/g, '$1')
		// `one.Two` -> `one. Two`
		// `one?Two` -> `one? Two`
		// (limited to ASCII because javascript doesn't support Unicode regexps yet)
		.replace(/([а-я][\.!?])([А-Я][а-я ])/g, '$1 $2')
		// `"one"` -> `«one»`
		// (must not preceed other regexps having a quote)
		.replace(/"\s*([^"]+?)\s*"/g, '«$1»')
		// `...` -> `…`
		.replace(/([а-яА-Я])\.\.\./g, '$1…')
}

function findClosingTagPosition(text, position, tagLevel = 0) {
	const tagPosition = text.indexOf('<', position)
	if (tagPosition >= 0) {
		if (text[tagPosition + 1] === '/') {
			tagLevel--
		} else {
			const tagEndingBracket = text.indexOf('>', tagPosition + 1)
			if (tagEndingBracket >= 0 && text[tagEndingBracket - 1] === '/') {
				//
			} else {
				tagLevel++
			}
		}
		if (tagLevel < 0) {
			return tagPosition
		}
		return findClosingTagPosition(text, tagPosition + 1, tagLevel)
	}
}

function parseSubjectFromComment(comment) {
	const match = comment.match(/^<strong>(?:<em>)?([^<]+)(?:<br>)?(?:<\/em>)?<\/strong>(?:(?:<br><br>)(.+))?$/)
	if (match) {
		return {
			subject: match[1],
			comment: match[2]
		}
	}
}

const IN_REPLY_TO_REGEXP = ' data-thread="(.+?)" data-num="(.+?)">'

function getInReplyToPosts(comment) {
	const matches = comment.match(new RegExp(IN_REPLY_TO_REGEXP, 'g'))
	if (!matches) {
		return []
	}
	return matches.map((match) => {
		match = match.match(new RegExp(IN_REPLY_TO_REGEXP))
		return {
			threadId: match[1],
			postId: match[2]
		}
	})
}

const IGNORE_WORDS = new RegExp('^(пидора[шх].*|пыня|пыни|пыню|коммуняк|хуесос.*|карлан.*|блядски.*|выблядк.*|поебал.*|чмо|рашка|рашко.*)$', 'i')
const IGNORE_WORDS_CASE_SENSITIVE = new RegExp('^(РАБот.*)$')

function filterComment(comment) {
	const words = comment.split(/[^а-яА-Я]+/)
	for (const word of words) {
		if (IGNORE_WORDS.test(word) || IGNORE_WORDS_CASE_SENSITIVE.test(word)) {
			return false
		}
	}
	return true
}

function expectToEqual(actual, expected) {
	if (!isEqual(actual, expected)) {
		console.log('Actual', JSON.stringify(actual, null, 2))
		console.log('Expected', JSON.stringify(expected, null, 2))
		throw new Error('Expected to equal')
	}
}

expectToEqual(
	getInReplyToPosts("<a href=\"/test/res/30972.html#100453\" class=\"post-reply-link\" data-thread=\"30972\" data-num=\"100453\">>>100453</a><br><a href=\"/test/res/30972.html#100454\" class=\"post-reply-link\" data-thread=\"30972\" data-num=\"100454\">>>100454</a><br><br>test"),
	[{
		threadId: '30972',
		postId: '100453'
	}, {
		threadId: '30972',
		postId: '100454'
	}]
)

expectToEqual(
	correctGrammar('a,b ,c , d, e -- f - g'),
	'a, b, c, d, e — f — g'
)

expectToEqual(
	correctGrammar('раз.Два'),
	'раз. Два'
)

expectToEqual(
	correctGrammar('раз(два)'),
	'раз (два)'
)

expectToEqual(
	correctGrammar('раз?(два)'),
	'раз? (два)'
)

expectToEqual(
	correctGrammar('"раз"(два)'),
	'«раз» (два)'
)

expectToEqual(
	correctGrammar('" раз "'),
	'«раз»'
)

expectToEqual(
	parseSubjectFromComment('<strong>abc</strong>'),
	{ subject: 'abc', comment: undefined }
)

expectToEqual(
	parseSubjectFromComment('<strong>abc</strong><br><br>def'),
	{ subject: 'abc', comment: 'def' }
)

function parseCommentTest(comment, result, parseParagraphs = true) {
	return expectToEqual(parseComment(comment, parseParagraphs), result)
}

parseCommentTest(
	"Sosach ,возник вопрос ,как легче всего воровать пароли ,допустим в кабинете информатики ?",
	[
		// ["Sosach ,возник вопрос ,как легче всего воровать пароли ,допустим в кабинете информатики ?"]
		["Sosach, возник вопрос, как легче всего воровать пароли, допустим в кабинете информатики?"]
	]
)

parseCommentTest(
	'<a href=\"https:&#47;&#47;www.youtube.com&#47;watch?v=dIFbIUUo0OU\" target=\"_blank\" rel=\"nofollow noopener noreferrer\">https:&#47;&#47;www.youtube.com&#47;watch?v=dIFbIUUo0OU</a>',
	[
		[{
			"type": "link",
			content: "youtube.com/watch?v=dIFbIUUo0OU",
			"url": "https://www.youtube.com/watch?v=dIFbIUUo0OU"
		}]
	]
)

parseCommentTest(
	"Помогите найти видео. Там мужик кулаками машет и делат так &quot;уц-уц-уц&quot; или &quot;уш-уш-уш&quot;. Вроде демонстрации кунфу.",
	[
		[
			'Помогите найти видео. Там мужик кулаками машет и делат так «уц-уц-уц» или «уш-уш-уш». Вроде демонстрации кунфу.'
		]
	]
)

parseCommentTest(
	"Двачик, мне нужно ненадолго уйти. Присмотри пожалуйста за моим ручный Украинцем, АТО он <strong>ЗАМЕРЗНЕТ</strong>",
	[
		[
			'Двачик, мне нужно ненадолго уйти. Присмотри пожалуйста за моим ручный Украинцем, АТО он ',
			{
				type: 'text',
				style: 'bold',
				content: 'ЗАМЕРЗНЕТ'
			}
		]
	]
)

// parseCommentTest(
// 	'<span class="spoiler">yandex emoji translator</span><br><br>,  ❓   ❓   .    ⚪️➡️    &amp;  .   ❔       ,   ☠ ❓  ,  ‍♂  &amp; ❓ . &amp; ⤴   ⛏   ‍‍,   ❔     &amp;   ⁉    . ‍♂   ‍,   , &amp;    , &amp; ⤴         , ✋️ 9⃣th , ❔      ,  ➡️  ⭕, &amp; ⤴     8⃣ . ❔ ,  ❓"',
// 	[
// 		[{
// 			type: 'spoiler',
// 			content: 'yandex emoji translator'
// 		}],
// 		[
// 			',  ❓   ❓   .    ⚪️➡️    &  .   ❔       ,   ☠ ❓  ,  ‍♂  & ❓ . & ⤴   ⛏   ‍‍,   ❔     &   ⁉    . ‍♂   ‍,   , &    , & ⤴         , ✋️ 9⃣th , ❔      ,  ➡️  ⭕, & ⤴     8⃣ . ❔ ,  ❓"'
// 		]
// 	]
// )

parseCommentTest(
	'abc<br>def',
	[
		[
			'abc',
			'\n',
			'def'
		]
	]
)

parseCommentTest(
	'<span class="spoiler">Text<br>Text</span>',
	[
		[{
			type: 'spoiler',
			content: [
				'Text',
				'\n',
				'Text'
			]
		}]
	]
)

// parseCommentTest(
// 	'<span class="spoiler">Text<br>- a<br>- b<br>Text<a href="https://github.com/mamkin-coder-228/yoba-brain/blob/master/main.go" target="_blank" rel="nofollow noopener noreferrer">https://github.com/mamkin-coder-228/yoba-brain/blob/master/main.go</a></span>',
// 	[
// 		[{
// 			type: 'spoiler',
// 			content: [
// 				'Text',
// 				'\n',
// 				'- a',
// 				'\n',
// 				'- b',
// 				'\n',
// 				'Text',
// 				{
// 					type: 'link',
// 					url: 'https://github.com/mamkin-coder-228/yoba-brain/blob/master/main.go',
// 					content: 'github.com/mamkin-coder-228/yoba-brain/blob/master/main.go'
// 				}
// 			]
// 		}]
// 	]
// )

parseCommentTest(
	'<strong>test</strong><br><em>test</em><br><span class="unkfunc">&gt;test</span><br><span class=\"u\">test</span><br><span class=\"o\">test</span><br><span class=\"spoiler\">test</span><br><span class=\"s\">test</span><br><sup>test</sup><br><sub>test</sub>',
	[
		[{
			type: 'text',
			style: 'bold',
			content: 'test'
		},
		'\n',
		{
			type: 'text',
			style: 'italic',
			content: 'test'
		},
		'\n',
		{
			type: 'quote',
			content: 'test'
		},
		'\n',
		'test',
		'\n',
		'test',
		'\n',
		{
			type: 'spoiler',
			content: 'test'
		},
		'\n',
		{
			type: 'text',
			style: 'strikethrough',
			content: 'test'
		},
		'\n',
		{
			type: 'text',
			style: 'superscript',
			content: 'test'
		},
		'\n',
		{
			type: 'text',
			style: 'subscript',
			content: 'test'
		}]
	]
)

parseCommentTest(
	'<span class=\"spoiler\">&gt;<span class=\"s\">тест</span></span>',
	[
		[
			{
				"type": "spoiler",
				"content": [
					">",
					{
						"type": "text",
						"style": "strikethrough",
						"content": "тест"
					}
				]
			}
		]
	]
)

parseCommentTest(
	'<a href=\"/v/res/3475861.html#3476088\" class=\"post-reply-link\" data-thread=\"3475861\" data-num=\"3476088\">>>3476088</a>',
	[
		[{
			type: 'post-link',
			threadId: '3475861',
			postId: '3476088',
			url: 'https://2ch.hk/v/res/3475861.html#3476088',
			content: '3476088'
		}]
	]
)

parseCommentTest(
	'<span class="unkfunc">&gt;Отмечается, что в ходе <strong>контрснайперской борьбы</strong>, украинский снайпер ликвидировал наемника из РФ. </span>',
	[
	  [
	    {
	      "type": "quote",
	      "content": [
	        "Отмечается, что в ходе ",
	        {
	          "type": "text",
	          "style": "bold",
	          "content": "контрснайперской борьбы"
	        },
	        ", украинский снайпер ликвидировал наемника из РФ. "
	      ]
	    }
	  ]
	]
)

parseCommentTest(
	'<strong>вопрос к тням</strong><br>Несколько лет назад...<br><br>Так же, пост из моего прошлого треда, на эту же тему:<br><em>...</em><br><br><br><span class="unkfunc">&gt;Дискасс.</span>',
	[
		[
			{
				type: 'text',
				style: 'bold',
				content: 'вопрос к тням'
			},
			'\n',
			'Несколько лет назад…'
		],
		[
			'Так же, пост из моего прошлого треда, на эту же тему:',
			'\n',
			{
				type: 'text',
				style: 'italic',
				content: '...'
			}
		],
		[
			{
				type: 'quote',
				content: 'Дискасс.'
			}
		]
	]
)

// parseCommentTest(
// 	'<p style=\"color:green;\">',
// 	// Won't be implemented.
// )

expectToEqual(
	getHumanReadableLinkAddress('http://youtube.com'),
	'youtube.com'
)

expectToEqual(
	getHumanReadableLinkAddress('https://youtube.com'),
	'youtube.com'
)

expectToEqual(
	getHumanReadableLinkAddress('https://www.youtube.com'),
	'youtube.com'
)