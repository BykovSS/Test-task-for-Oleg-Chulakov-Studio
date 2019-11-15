import constants from '../constants'

//Инициализация начального состояния
const initialState = {
	view: 'table',
	lang: 'rus',
	sort_atr: 'id',
	sort_ascend: 'ascend',
	query: ''
}

//Создание редьюсера для обработки действий и внесения изменений в часть state, которая отвечает за параметры сортировки
const sortParamsReducer = (state = initialState, action) => {
	switch (action.type) {
		case constants.UPDATE_SORT_PARAMS:
			return Object.assign({}, state, action.params)
		default:
			return state
	}
}

export default sortParamsReducer