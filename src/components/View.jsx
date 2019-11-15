import React from 'react'
import PropTypes from 'prop-types'
import TableItem from "./TableItem.jsx";
import PreviewItem from './PreviewItem.jsx'

const ViewComponent = ({people, lang, view, translateWord, handleUpdateFavouriteStatus}) => {
	//Компонент, отвечающий за отображение списка людей указанным методом
	let count = 0
	return (
		<div className={`view${view === 'table' ? ' table' : ' preview'}`}>
			<ul className="view__items-wrap">
				{people.map(man => {
					man.video ? count = 0 : count++
					return (
						view === 'table'
						?
						<TableItem
							key={man.id}
							man={man}
							lang={lang}
							handleUpdateFavouriteStatus={handleUpdateFavouriteStatus}
							translateWord={translateWord}
						/>
						:
						<PreviewItem
							key={man.id}
							man={man}
							lang={lang}
							count={count}
							handleUpdateFavouriteStatus={handleUpdateFavouriteStatus}
							translateWord={translateWord}
						/>
					)
				})}
			</ul>
		</div>
	)
}

ViewComponent.propTypes = {
	people: PropTypes.arrayOf(PropTypes.object).isRequired,
	lang: PropTypes.oneOf(['rus', 'eng']).isRequired,
	view: PropTypes.oneOf(['table', 'preview']).isRequired,
	translateWord: PropTypes.func.isRequired,
	handleUpdateFavouriteStatus: PropTypes.func.isRequired
}

export default ViewComponent