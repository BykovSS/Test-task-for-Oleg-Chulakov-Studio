import React from 'react'
import {render} from 'react-dom'
import { Provider } from 'react-redux'
import appStore from './store'
import { AppContainer, setConfig } from 'react-hot-loader'
import {Switch, Route, Redirect} from 'react-router'
import {HashRouter} from 'react-router-dom'

import App from './containers/App.jsx'
import './assets/styles/palette.scss'
import './assets/styles/style.scss'


const renderApp = Component => {
	render(
		<AppContainer>
			<Provider key={module.hot ? Date.now() : appStore} store={appStore}>
				<HashRouter>
					<Switch>
						<Route exact path="/" render={props => {
							return <Redirect to={{pathname: "/view=table&lang=rus&sort_atr=id&sort_ascend=ascend&query="}}/>
						}}/>
						<Route path='/:parameters' component={Component} />
					</Switch>
				</HashRouter>
			</Provider>
		</AppContainer>,
		document.querySelector('#mount-point')
	)
}

renderApp(App)

if (module.hot) {
	module.hot.accept('./containers/App.jsx', () => renderApp(App))
}

setConfig({
	showReactDomPatchNotification: false
})