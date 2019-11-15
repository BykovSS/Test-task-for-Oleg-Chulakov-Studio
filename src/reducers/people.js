import constants from '../constants'

//Инициализация начального состояния
const initialState = {
	people: [],
	isFetching: false,
	error: null
}

//Создание редьюсера для обработки действий и внесения изменений в часть state, которая отвечает за данные людей
const peopleReducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.FETCH_DATA_REQUEST:
			return Object.assign({}, state, {isFetching: true})
		case constants.FETCH_DATA_SUCCESS:
			return Object.assign({}, state, {people: action.people, isFetching: false})
		case constants.FETCH_DATA_FAILURE:
			return Object.assign({}, state, {error: action.error, isFetching: false})
		case constants.UPDATE_FAVOURITE_STATUS:
			return Object.assign({}, state, {people: state.people.map(man => {
				if (action.id === man.id) {
					return Object.assign({}, man, {id: action.id, favourite: action.favourite})
				}
				return man
			})})
		default:
			return state
	}
}

export default peopleReducer