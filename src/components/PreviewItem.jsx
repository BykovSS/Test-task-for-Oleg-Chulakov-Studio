import React from 'react'
import PropTypes from 'prop-types'

const PreviewItem = ({man, lang, count, handleUpdateFavouriteStatus, translateWord}) => {
	//Конпонент для отображения отдельного поля представления в виде Превью
	return (
		<li id={`${man.id}_item`} className={`list__item preview__item${man.video ? ' with-video' : count % 2 === 1 ? ' left' : ' right'}`} key={man.id}>
			<div className="list__info-wrap preview__info-wrap">
				<div className="list__person preview__person">
					<div className="list__avatar preview__avatar">
						<img src={`./assets/images/${man.image}.svg`} alt={man.image}/>
					</div>
					<div className="list__name preview__name">{man.name}</div>
					<div className={`list__favourite preview__favourite ${man.favourite ? 'active' : ''}`} onClick={handleUpdateFavouriteStatus.bind(null, man.id)}>&#9733;</div>
				</div>
				<div className="list__age preview__age">{man.age} {lang==='eng' ? translateWord('год', lang) : (man.age % 10 ===1) ? "год" : (man.age % 10 ===2 || man.age % 10 ===3 || man.age % 10 ===4) ? "года" : "лет" }</div>
				<div className="list__phone preview__phone">{man.phone}</div>
				<div className="list__phrase preview__phrase">{man.phrase}</div>
			</div>
			{
				man.video
					?
					<div className="list__video-wrap preview__video-wrap">
						<video controls className="list__video preview__video" muted="muted">
							<source src={`./assets/videos/${man.video}.mp4`} />
						</video>
					</div>
					:
					null
			}

		</li>
	)
}

PreviewItem.propTypes = {
	man: PropTypes.shape({
		id: PropTypes.number.isRequired,
		favourite: PropTypes.bool.isRequired,
		name: PropTypes.string.isRequired,
		age: PropTypes.number.isRequired,
		phone: PropTypes.string.isRequired,
		image: PropTypes.string.isRequired,
	}).isRequired,
	lang: PropTypes.string.isRequired,
	count: PropTypes.number.isRequired,
	handleUpdateFavouriteStatus: PropTypes.func.isRequired,
	translateWord: PropTypes.func.isRequired
}

export default PreviewItem