import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {fetchPeople, updateSortParams} from '../actions'
import Preloader from '../components/Preloader.jsx'
import Header from './Header.jsx'
import View from './View.jsx'
import Error from '../components/Error.jsx'


const App = ({isFetching, error, location, history, match, sortParams, fetchPeople, updateSortParams}) => {

		//Объект названий переменных состояния и их возможных значений
		const param_val = [{
			id: 1,
			name: 'view',
			value: [{
				id: 11,
				name: 'table',
				value: 'Таблица'
			},{
				id: 12,
				name: 'preview',
				value: 'Превью'
			}]
		},{
			id: 2,
			name: 'lang',
			value: [{
				id: 21,
				name: 'rus',
				value: 'Русский'
			},{
				id: 22,
				name: 'eng',
				value: 'Английский'
			}]
		},{
			id: 3,
			name: 'sort_atr',
			func_arg: (arg) => [arg, null],
			value: [{
				id: 31,
				name: 'id',
				value: 'ID'
			},{
				id: 32,
				name: 'name',
				value: 'Имя'
			},{
				id: 33,
				name: 'age',
				value: 'Возраст'
			}]
		},{
			id: 4,
			name: 'sort_ascend',
			func_arg: (arg) => [null, arg],
			value: [{
				id: 41,
				name: 'ascend',
				value: 'По возрастанию'
			},{
				id: 42,
				name: 'descend',
				value: 'По убыванию'
			}]
		},{
			id: 5,
			name: 'query',
			value: ['']

		}]
	// }

	//Функция для перевода слов. Принимает само слово и язык, на который его необходимо перевести.
	//Возвращает либо перевод этого слова (если слово есть в словаре), либо исходное слове (непереведенное)
	const translateWord = (word, lang) => {
		//Проверка переменной языка
		if (param_val.filter(item => {
			if (item.name === 'lang') {
				return item
			}
		})[0].value.reduce((rez, item) => {
			return rez || item.name === lang
		}, false)) {
			//Словарь
			const dictionary = [
				{word: 'Выберите язык', rus: 'Выберите язык', eng: "Select language"},
				{word: 'Русский', rus: 'Русский', eng: "Russian"},
				{word: 'Английский', rus: 'Английский', eng: "English"},
				{word: 'Сортировка', rus: 'Сортировка', eng: "Sort"},
				{word: 'Вид', rus: 'Вид', eng: "View"},
				{word: 'ID', rus: 'ID', eng: "ID"},
				{word: 'Имя', rus: 'Имя', eng: "Name"},
				{word: 'Возраст', rus: 'Возраст', eng: "Age"},
				{word: 'По возрастанию', rus: 'По возрастанию', eng: "In ascending order"},
				{word: 'По убыванию', rus: 'По убыванию', eng: "In descending order"},
				{word: 'Таблица', rus: 'Таблица', eng: "Table"},
				{word: 'Превью', rus: 'Превью', eng: "Preview"},
				{word: 'Введите Имя и Фамилию', rus: 'Введите Имя и Фамилию', eng: 'Enter Name and Surname'},
				{word: 'год', rus: 'год', eng: "years"},
				{word: 'Данные не могут быть загружены...', rus: 'Данные не могут быть загружены...', eng: 'Data cannot be downloaded...'}
			]
			//Поиск нужного слова в словаре
			const rezult = dictionary.filter(item => {
				return item.word === word
			})
			//Если слово надено, то возвращается нужное языковое значение
			if (rezult.length > 0) {
				return rezult[0][lang]
			}
		}
		//Если необходимого языка нет в словаре или слово не найдено, то возвращается искомое слово
		return word
	}

	//Функция конвертации адресной строки (url) в объект.
	//Принимает адресную строку (url), возвращает отконвертированный объект
	const parseUrl = (url) => {
		//Параметры в адресной строке разделены символом &.
		//По данному символу разделяем строку на массив строк, в каждой из которых есть ключ и значение
		//Для всех значения данного массива:
		return url.split('&').reduce((obj,item) => {
			//Разделяем значение массива на отдельный массив с ключом и значением
			const localvar = item.replace("/", "").split('=')
			//Сравниваем полученное название параметра со всеми названиями параметров, которые сохраняются в адресной строке
			//Если значения названий совпадают, то значение параметра сохраняется в соответствующее название объекта
			//Если название параметра ни с кем не совпадает, то оно игнорируется
			param_val.forEach(param => {
				if (localvar[0]===param.name) {
					obj = Object.assign({}, obj, {[param.name]: localvar[1]})
				}
				obj = Object.assign({}, obj)
			})
			return obj
		}, {})
	}

	//Функция получения актуального значения состояния из адресной строки
	//Получает адресную строку и сохраняет полученные из строки значения в store
	const getStateFromUrl = (url) => {
		//Конвертирование адресной строки в объект
		const urlObj = parseUrl(url)
		//Проверка валидности значений параметров из адресной строки.
		//Если значение параметров из строки невалидно, то оно берется из store
		let newUrlObj = {}
		param_val.forEach(param => {
			if (param.value.reduce((rez, item) => {
				return rez || urlObj[param.name] === item.name || param.name === 'query'
			}, false)) {
				newUrlObj = Object.assign({}, newUrlObj, {[param.name]: urlObj[param.name]})
			} else newUrlObj = Object.assign({}, newUrlObj, {[param.name]: sortParams[param.name]})
		})
		//Проверяем полученный объект и значения состояния
		//Результат проверки - объект, в котором указаны различающиеся параметры, с значениями из url
		let rezultObj = {}
		for (let prop in newUrlObj) {
			if (newUrlObj[prop] !== sortParams[prop]) {
				rezultObj[prop] = newUrlObj[prop]
			}
		}
		//Если объект с различающимися параметрами не пустой, то
		if (!rezultObj.length) {
			//Вносим изменения в url (если какие-то из параметров были указаны некорректно)
			let path = `/view=${newUrlObj.view}&lang=${newUrlObj.lang}&sort_atr=${newUrlObj.sort_atr}&sort_ascend=${newUrlObj.sort_ascend}&query=${newUrlObj.query}`
			replaceHistory(path)
			//Запускаем функцию обновления данных store с новыми значениями
			updateSortParams(rezultObj)
		}
	}

	//Функция внесения изменений в адресную строку (url)
	//Получает адрес и вносит его в history
	const replaceHistory = (path) => {
		if (location.pathname !== path) {
			history.replace(path)
		}
	}

	useEffect(() => {
			//После первой отрисовки запускаем функцию для получения массива людей
			fetchPeople()
		}, []
	)

	useEffect(() => {
			//Получаем значения состояния из url
			getStateFromUrl(match.params.parameters)
		}, [match.params.parameters]
	)

	return (
		//Если данные еще в процессе получения, то отображается прелоадер
		isFetching
		?
			<Preloader />
		:
			<div className="app">
				<Header
					param_val={param_val}
					pathname={location.pathname}
					translateWord={translateWord}
					replaceHistory={replaceHistory}
				/>
				{error !== null
					?
					<Error
						translateWord={translateWord}
						lang={sortParams.lang}
					/>
					:
					<View
						param_val={param_val}
						translateWord={translateWord}
					/>
				}
			</div>
	)
}

App.propTypes = {
	isFetching: PropTypes.bool.isRequired,
	error: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
	location: PropTypes.object.isRequired,
	history: PropTypes.object.isRequired,
	match: PropTypes.object.isRequired,
	sortParams: PropTypes.shape({
		view: PropTypes.oneOf(['table', 'preview']).isRequired,
		lang: PropTypes.oneOf(['rus', 'eng']).isRequired,
		sort_atr: PropTypes.oneOf(['id', 'name', 'age']).isRequired,
		sort_ascend: PropTypes.oneOf(['ascend', 'descend']).isRequired,
		query: PropTypes.string.isRequired
	}),
	fetchPeople: PropTypes.func.isRequired,
	updateSortParams: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		isFetching: state.peopleReducer.isFetching,
		error: state.peopleReducer.error,
		sortParams: state.sortParamsReducer
	}
}

const mapDispatchToProps = dispatch => {
	return {
		fetchPeople: () => dispatch(fetchPeople()),
		updateSortParams: (data) => dispatch(updateSortParams(data))
	}
}


export default connect(mapStateToProps, mapDispatchToProps)(App)