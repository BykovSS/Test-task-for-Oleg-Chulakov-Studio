import React from 'react'
import PropTypes from 'prop-types'

const TableItem = ({man, lang, handleUpdateFavouriteStatus, translateWord}) => {
	//Конпонент для отображения отдельного поля представления в виде Таблицы
	return (
		<li id={`${man.id}_item`} className="list__item table__item">
			<div className="list__avatar table__avatar">
				<img src={`./assets/images/${man.image}.svg`} alt={man.image}/>
			</div>
			<div className="list__name table__name">{man.name}</div>
			<div className="list__age table__age">{man.age} {lang==='eng' ? translateWord('год', lang) : (man.age % 10 ===1) ? "год" : (man.age % 10 ===2 || man.age % 10 ===3 || man.age % 10 ===4) ? "года" : "лет" }</div>
			<div className="list__phone table__phone">{man.phone}</div>
			<div className={`list__favourite table__favourite ${man.favourite ? 'active' : ''}`} onClick={handleUpdateFavouriteStatus.bind(null, man.id)}>&#9733;</div>
		</li>
	)
}

TableItem.propTypes = {
	man: PropTypes.shape({
		id: PropTypes.number.isRequired,
		favourite: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		age: PropTypes.number.isRequired,
		phone: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
	}).isRequired,
	lang: PropTypes.string.isRequired,
	handleUpdateFavouriteStatus: PropTypes.func.isRequired,
	translateWord: PropTypes.func.isRequired
}

export default TableItem