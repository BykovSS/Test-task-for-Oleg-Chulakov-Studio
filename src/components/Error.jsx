import React from 'react'
import PropTypes from "prop-types";

const Error = ({lang, translateWord}) => {
	//Компонент для отображения информации об ошибке при получении данных

	return (
		<div className="error">
			{translateWord('Данные не могут быть загружены...', lang)}
		</div>
	)
}

Error.propTypes = {
	lang: PropTypes.oneOf(['rus', 'eng']).isRequired,
	translateWord: PropTypes.func.isRequired
}

export default Error