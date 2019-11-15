import {createStore, applyMiddleware, compose} from 'redux'
import mainReducer from '../reducers'
import reduxThunk from 'redux-thunk'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

//Создание store
const appStore = createStore(
	mainReducer,
	composeEnhancers(
		applyMiddleware(reduxThunk)
	)
)

export default appStore