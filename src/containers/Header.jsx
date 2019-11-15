import React from "react"
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateSortParams} from "../actions"
import HeaderComponent from '../components/Header.jsx'

const Header = ({sortParams, updateSortParams, param_val, pathname, translateWord, replaceHistory}) => {
	//Получаем значение переменных состояния
	const {view, lang, sort_atr, sort_ascend, query} = sortParams

	//Функция смены языка интерфейса. Принимает значение языкы, на который необходимо поменять интерфейс,
	//и изменяет текущее значение языка на переданное.
	const handleChangeLanguage = (language) => {
		//Проверка переменной языка
		if (param_val.filter(item => {return item.name === 'lang'})[0].value.reduce((rez, item) => {return rez || language === item.name}, false)) {
			//Если значение языка, переданного в функцию, не совпадает со значением текущего языка, то:
			if (lang !== language) {
				//Изменяем текущий url с учетом нового значения языка
				replaceHistory(pathname.replace(`&lang=${lang}&`, `&lang=${language}&`))
				//Запускаем функцию обновления данных store с новым значением языка
				updateSortParams({lang: language})
			}
		}
	}

	//Функция смены параметров сортировки.
	//Принимает пару параметров сортировки (сортируемый столбец и направление сортировки)
	//и изменяет текущие значения сортировки на переданные
	const handleChangeSortParams = ([newSort_atr, newSort_ascend]) => {
		// Проверка значений переданных переменных параметров сортировки
		if (param_val.filter(item => {if (item.name === 'sort_atr' || item.name === 'sort_ascend') return item}).reduce((rez, elem) => {
			return rez && elem.value.reduce((loc_rez, loc_item) => {
				return loc_rez || (elem.name === 'sort_atr' ? loc_item.name === newSort_atr : loc_item.name === newSort_ascend) || newSort_atr === null || newSort_ascend === null
			}, false)
		}, true)) {
			//Если какое-то из переданных значений параметров сортировки равно null, то используется текущее значение сортировки
			const loc_sort_atr = newSort_atr ? newSort_atr : sort_atr
			const loc_sort_ascend = newSort_ascend ? newSort_ascend : sort_ascend
			//Если текущие значения сортировки и переданные не совпадают (хотя бы одно из них), то:
			if (sort_atr !== loc_sort_atr || sort_ascend !== loc_sort_ascend) {
				//Изменяем текущий url с учетом новых значений сортировки
				let path = pathname.replace(`&sort_atr=${sort_atr}&`, `&sort_atr=${loc_sort_atr}&`)
				replaceHistory(path.replace(`&sort_ascend=${sort_ascend}&`, `&sort_ascend=${loc_sort_ascend}&`))
				//Запускаем функцию обновления данных store с новыми значениями для сортировки
				updateSortParams({sort_atr: loc_sort_atr, sort_ascend: loc_sort_ascend})
			}
		}
	}

	//Функция смены представления вывода данных.
	//Принимает необходимый вид отображения
	//и изменяет текущие значения отображения на переданное
	const handleChangeView = (newView) => {
		// Проверка переменной отображения
		if (param_val.filter(item => {return item.name === 'view'})[0].value.reduce((rez, item) => {return rez || newView === item.name}, false)) {
			//Если значение отображения, переданного в функцию, не совпадает со значением текущего отображения, то:
			if (view !== newView) {
				//Изменяем текущий url с учетом нового значения отображения
				replaceHistory(pathname.replace(`/view=${view}&`, `/view=${newView}&`))
				//Запускаем функцию обновления данных store с новым значением отображения
				updateSortParams({view: newView})
			}
		}
	}

	//Функция смены ключевого слова для фильтрации.
	//Принимает объект события onChange поля для ввода
	//и заменяет текущее значение ключевого слова на переданное в объекте события
	const handleChangeQuery = (e) => {
		//Убираем лишние пробелы
		const local_query = e.target.value.replace(/ +/g, ' ')
		//Если текущее значение ключевого слова не совпадает с переданным, то:
		if (local_query !== query) {
			//Изменяем текущий url с учетом нового значения ключевого слова
			replaceHistory(pathname.replace(`&query=${query}`, `&query=${local_query}`))
			//Запускаем функцию обновления данных store с новым значением ключевого слова
			updateSortParams({query: local_query})
		}
	}

	return <HeaderComponent
			view={view}
			lang={lang}
			sort_atr={sort_atr}
			sort_ascend={sort_ascend}
			query={query}
			param_val={param_val}
			handleChangeLanguage={handleChangeLanguage}
			handleChangeSortParams={handleChangeSortParams}
			handleChangeView={handleChangeView}
			handleChangeQuery={handleChangeQuery}
			translateWord={translateWord}
		/>
}

Header.propTypes = {
	sortParams: PropTypes.shape({
		view: PropTypes.oneOf(['table', 'preview']).isRequired,
		lang: PropTypes.oneOf(['rus', 'eng']).isRequired,
		sort_atr: PropTypes.oneOf(['id', 'name', 'age']).isRequired,
		sort_ascend: PropTypes.oneOf(['ascend', 'descend']).isRequired,
		query: PropTypes.string.isRequired
	}).isRequired,
	updateSortParams: PropTypes.func.isRequired,
	param_val: PropTypes.arrayOf(PropTypes.object).isRequired,
	pathname: PropTypes.string.isRequired,
	translateWord: PropTypes.func.isRequired,
	replaceHistory: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		sortParams: state.sortParamsReducer
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateSortParams: (data) => dispatch(updateSortParams(data))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Header)