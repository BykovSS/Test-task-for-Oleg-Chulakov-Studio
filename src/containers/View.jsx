import React, {useEffect} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {updateFavouriteStatus} from "../actions"
import ViewComponent from '../components/View.jsx'

const View = ({people, sortParams, updateFavouriteStatus, param_val, translateWord}) => {
	//Получаем значение переменных состояния
	const {view, lang, sort_atr, sort_ascend, query} = sortParams

	//Функция сортировки массива людей с учетом параметров сортировки.
	//Принимает массив с информацией о людях и пару параметров сортировки (сортируемый столбец и направление сортировки)
	//и возвращает отсортированный по нужным параметрам массив
	const sortPeople = (people, sort_atr, sort_ascend) => {
		//Проверка значений переданных параметров сортировки
		if (param_val.filter(item => {return item.name === 'sort_atr' || item.name === 'sort_ascend'}).reduce((rez, item) => {
			return rez && item.value.reduce((loc_rez, loc_item) => {
				return loc_rez || (item.name === 'sort_atr' ? loc_item.name === sort_atr : loc_item.name === sort_ascend)
			}, false)
		}, true)) {
			//Возврат отсортированного массива
			return people.sort((a, b) => {
				if (sort_ascend === 'ascend') {
					if (a[sort_atr] > b[sort_atr]) return 1
					if (a[sort_atr] < b[sort_atr]) return -1
				} else {
					if (a[sort_atr] < b[sort_atr]) return 1
					if (a[sort_atr] > b[sort_atr]) return -1
				}
				if (a[sort_atr] === b[sort_atr]) return 0
			})
		}
		//Если значения параметров для сортировки невалидны, то возвращается исходный массив
		return people
	}

	//Функция фильтрации массива людей с учетом ключевого слова
	//Принимает массив с информацией о людях и ключевое слово для фильтрации
	const filterPeople = (people, query) => {
		//Проверка переданного ключевого слова на пустоту
		if (query !== "") {
			//Сохраняем в отдельные переменные условные Имя и Фамилию.
			//Имя и Фамилия разделены в ключевом слове пробелом.
			//Символы после второго пробела в фильтрации не учитываются
			let [name, surname=''] = query.split(' ')
			//Возвращаем отфильтрованный массив
			return people.filter(item => {
				const [loc_name, loc_surname] = item.name.split(' ')
				return (loc_name.toLowerCase().indexOf(name.toLowerCase()) !== -1 && loc_surname.toLowerCase().indexOf(surname.toLowerCase()) !== -1) || (loc_name.toLowerCase().indexOf(surname.toLowerCase()) !== -1 && loc_surname.toLowerCase().indexOf(name.toLowerCase()) !== -1)
			})
		}
		//Если ключевое слово пустое, то возвращаем исходный массив
		return people
	}

	//Функция обновления статуса "в избранном" элементов массива людей
	//Принимает id элемента, изменяет этому элементу статус и вносит изменения в хранилище
	const handleUpdateFavouriteStatus = (id) => {
		//Находим среди элементов массива элемент с нужным id
		const status = people.filter(item => {
			return item.id === id
		})
		//Запускаем функцию обновления данных store со значением id элемента и новым статусом
		updateFavouriteStatus(id, !status[0].favourite)
	}

	//Функция постановки на паузу всех видеозаписей, кроме переданного в событии
	const setPause = (videos, event) => {
		videos.forEach(video => {
			if (event) {
				event.target !== video ? video.pause() : null
			}
			else video.pause()
		})
	}

	useEffect(() => {

		//Находим все тэги video
		const videos = document.querySelectorAll('video')

		 if (videos.length > 0) {
			 //Всем видеозаписям добавляем функцию setPause в обработчик события 'playing'
			 document.querySelectorAll('video').forEach(elem => {
				 elem.addEventListener('playing', setPause.bind(null, videos), false)
			 })

			 //Задаем функцию отмены "подписки" на событие
			 return document.querySelectorAll('video').forEach(elem => {
				 elem.removeEventListener('playing', setPause.bind(null, videos), false)
			 })
		 }
	}, [view])

	//Функция автозапуска видео
	const autoPlay = (videos, win_height) => {
		//Для каждого элемента видео
		videos.forEach(video => {
			//Проверяем играет ли сейчас видео и значение проверки сохраняем в переменную
			const isPlaying = !!(video.currentTime > 0 && !video.paused && !video.ended && video.readyState > 2)
			//Находим верхнее и нижнее значение элемента относительно окна браузера
			const {top, bottom} = video.getBoundingClientRect()
			//Проверяем находится ли середина экрана между этими значениями
			if (top <= win_height/2 && bottom >= win_height/2) {
				if (!isPlaying) {
					//Если середина экрана находится между этими значениями, то
					//Если текущее видео не играет, то ставим все видео на паузу и включаем текущее видео
					setPause(videos)
					video.play()
				}
			}
			else {
				//Если середина экрана не находится между этими значениями, то
				//Если текущее видео играет, то ставим все видео на паузу
				if (isPlaying) {
					setPause(videos)
				}
			}
		})
	}

	useEffect(() => {

		//Находим все тэги video и помещаем их в массив
		const videos = document.querySelectorAll('video')

		//Проверяем пустоту полученного массива
		if (videos.length > 0) {
			//Получаем высоту окна браузера
			const win_height = window.innerHeight;

			//Для каждого события scroll устанавливаем обработчик
			window.addEventListener('scroll', autoPlay.bind(null, videos, win_height), false)

			//Задаем функцию отмены "подписки" на событие
			return window.removeEventListener('scroll', autoPlay.bind(null, videos, win_height), false)
		}

	},[view])

	//Флаг окончания вывода списка
	let isFinish = false

	//Функция для плавного появления элемента путем изменения opacity
	const animateItem = (elem, display) => {
		//Устанавливаем начальное значение opacity
		let opacity = 0.01

		//Если список еще не до конца выведен, то устанавливаем переданному в функцию элементу значение display
		if (!isFinish) {
			elem.style.display = display ? display : 'block'
		}

		//Если расположение элемента списка ниже, чем окно браузера, то сигнализируем, что вывод списка закончен
		//и текущему элементу возвращается значение display
		if (elem.getBoundingClientRect().top > window.innerHeight) {
			isFinish = true
			elem.style.display = 'none'
		}

		if (!isFinish) {
		//Запускаем функцию для увеличения значения opacity через определенный интервал
			let timer = setInterval(() => {
				//Если значение opacity достигло 1, то функцию увеличения прерываем
				if(opacity >= 1) {
					clearInterval(timer)
				}
				//Присваиваем элементу новое значение opacity
				elem.style.opacity = opacity

				//Увеличиваем значение переменной c заданным шагом
				opacity += opacity * 0.1
			}, 10)
		}

	}

	useEffect(() => {

		//Находим все элементы таблицы/превью и помещаем их в массив
		let view_div = document.querySelectorAll('.list__item')

		//Проверяем пустоту данного массива
		if (view_div.length > 0) {

			//Задаем начальное значение шага и массив идентификаторов таймеров
			let count = 1
			let Timers = []

			//Для каждого элемента запускаем таймер с определенным шагом
			//с функцией изменения прозрачности id таймера сохраняем в массив
			view_div.forEach(elem => {
					Timers[count-1] = setTimeout(animateItem.bind(null, elem, 'flex'), count*20)
					count++
				}
			)

			const handleScroll = () => {
				//Если вывод список окончен
				if (isFinish) {
					//Обнуляем все текущие таймеры
					Timers.forEach(timer => {
						clearTimeout(timer)
					})
					Timers = []
					//Сообщаем, что вывод списка еще не окончен
					isFinish = false
					count = 1
					//Для всех элементов, у которых display не равен flex (которые не отображены)
					//повторно запускаем таймер с определенным шагом
					//с функцией изменения прозрачности id таймера сохраняем в массив
					view_div.forEach(elem => {
							if (elem.style.display !== 'flex') {
								Timers[count-1] = setTimeout(animateItem.bind(null, elem, 'flex'), count*20)
								count++
							}
						}
					)
				}
			}

			//Добавляем обработчик события scroll
			window.addEventListener('scroll', handleScroll, false)

			//Возвращаем функцию для приведения opacity и display в исходное состояние и сброса таймеров из массива таймеров
			return () => {
				let i = 0
				view_div.forEach(elem => {
					elem.style.opacity = 0
					elem.style.display = 'none'
					clearTimeout(Timers[i])
					i++
				})
				//Удаляем обработчик события scroll
				window.removeEventListener('scroll', handleScroll, false)
			}
		}
	},[sort_atr, sort_ascend, view, query])

	return <ViewComponent
			people={filterPeople(sortPeople(people, sort_atr, sort_ascend), query)}
			lang={lang}
			view={view}
			translateWord={translateWord}
			handleUpdateFavouriteStatus={handleUpdateFavouriteStatus}
		/>
}

View.propTypes = {
	people: PropTypes.arrayOf(PropTypes.object).isRequired,
	sortParams: PropTypes.shape({
		view: PropTypes.oneOf(['table', 'preview']).isRequired,
		lang: PropTypes.oneOf(['rus', 'eng']).isRequired,
		sort_atr: PropTypes.oneOf(['id', 'name', 'age']).isRequired,
		sort_ascend: PropTypes.oneOf(['ascend', 'descend']).isRequired,
		query: PropTypes.string.isRequired
	}),
	updateFavouriteStatus: PropTypes.func.isRequired,
	param_val: PropTypes.arrayOf(PropTypes.object).isRequired,
	translateWord: PropTypes.func.isRequired
}

const mapStateToProps = state => {
	return {
		people: state.peopleReducer.people,
		sortParams: state.sortParamsReducer
	}
}

const mapDispatchToProps = dispatch => {
	return {
		updateFavouriteStatus: (id, status) => dispatch(updateFavouriteStatus(id, status))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(View)