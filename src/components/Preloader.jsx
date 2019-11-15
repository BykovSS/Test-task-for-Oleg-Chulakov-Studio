import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'

export default function Preloader() {
	//Компонент для отображения прелоадера в ожидании загрузки данных
	return (
		<div className="preloader-wrap">
			<CircularProgress
				size={60}
				thickness={5}
			/>
		</div>
		)
}