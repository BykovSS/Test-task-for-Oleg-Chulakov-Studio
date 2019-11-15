import fetch from 'isomorphic-fetch'
import constants from '../constants'

//Action Creator для создания действия отправки запроса для получения данных
export const peopleIsFatching = () => {
	return {
			type: constants.FETCH_DATA_REQUEST
	}
}

//Action Creator для создания действия успешного получения данных
function receivePeople(data) {
	return {
		type: constants.FETCH_DATA_SUCCESS,
		people: data
	}
}

//Action Creator для создания действия возникновения ошибки при получении данных
function errorFetchPeople(err) {
	return {
		type: constants.FETCH_DATA_FAILURE,
		error: err
	}
}

//Функция отправки запроса для получения данных и обработки ответа
export function fetchPeople(url = 'data.json') {
	return dispatch => {
		dispatch(peopleIsFatching())
		return fetch(`${url}`)
			.then(response => response.json())
			.then(data => dispatch(receivePeople(data)))
			.catch(err => dispatch(errorFetchPeople(err)))
	}
}

//Action Creator для создания действия обновления статуса "В избраноом"
export function updateFavouriteStatus(id, status) {
	return {
		type: constants.UPDATE_FAVOURITE_STATUS,
		id: id,
		favourite: status
	}
}

//Action Creator для создания действия обновления параметров сортировки и фильтрации
export function updateSortParams(data) {
	return {
		type: constants.UPDATE_SORT_PARAMS,
		params: data
	}
}


