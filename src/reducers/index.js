import { combineReducers } from 'redux'
import peopleReducer from './people'
import sortParamsReducer from "./sortparams"

//Объединение редьюсеров с один основной
const mainReducer = combineReducers({peopleReducer, sortParamsReducer})

export default mainReducer