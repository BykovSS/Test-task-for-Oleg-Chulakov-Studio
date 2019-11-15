import React from "react"
import PropTypes from 'prop-types'

const HeaderComponent = ({view, lang, sort_atr, sort_ascend, query, param_val, handleChangeLanguage, handleChangeSortParams, handleChangeView, handleChangeQuery, translateWord}) => {
	//Компонент для отображения интерактивной части приложения (переключатели и поле для ввода)
	//При необходимости переиспользовать некоторые элементы данного компонента (группу переключателей, кнопки и т.д.),
	//их можно вынести в отдельные компоненты
	return (
		<div className="header">
			<div className="languages">
				<div className="languages__label">{translateWord('Выберите язык', lang)}:</div>
				<div className="header__items-wrap languages__items-wrap">
					{
						param_val.filter(item => {return item.name === 'lang'})[0].value.map(item => {
							return <div
								key={item.id}
								className={`header__item languages__item${lang===item.name ? ' active' : ""}`}
								onClick={handleChangeLanguage.bind(null, item.name)}>
								{translateWord(item.value, lang)}
							</div>
						})
					}
				</div>
			</div>
			<div className="toggles">
				<div className="toggles__sort">
					<div className="header__title sort__title">{translateWord('Сортировка', lang)}</div>
					{
						param_val.filter(item => {return item.name === 'sort_atr' || item.name === 'sort_ascend'}).map(param => {
							return (
								<div
									key={param.id}
									className={`header__items-wrap sort__${param.name==='sort_atr' ? 'attribute' : 'ascend'}`}
								>
									{
										param.value.map(item => {
											return <div
												key={item.id}
												className={`header__item ${param.name==='sort_atr' ? 'attribute' : 'ascend'}__item${sort_atr === item.name || sort_ascend === item.name ? ' active' : ''}`}
												onClick={handleChangeSortParams.bind(null, param.func_arg(item.name))}>
												{translateWord(item.value, lang)}
											</div>
										})
									}
								</div>
							)
						})
					}
				</div>
				<div className="toggles__viewtp">
					<div className="header__title viewtp__title">{translateWord('Вид', lang)}</div>
					<div className="header__items-wrap viewtp__choice">
						{
							param_val.filter(item => {return item.name === 'view'})[0].value.map(item => {
								return (
									<div
										key={item.id}
										className={`header__item viewtp__item${item.name === view  ? ' active' : ''}`}
										onClick={handleChangeView.bind(null, item.name)}
									>
										{translateWord(item.value, lang)}
									</div>
								)
							})
						}
					</div>
				</div>
			</div>
			<div className="search">
				<input type="text" className="search__input" placeholder={translateWord('Введите Имя и Фамилию', lang)} onChange={handleChangeQuery} value={query}/>
			</div>
		</div>
	)
}

HeaderComponent.propTypes = {
	view: PropTypes.oneOf(['table', 'preview']).isRequired,
	lang: PropTypes.oneOf(['rus', 'eng']).isRequired,
	sort_atr: PropTypes.oneOf(['id', 'name', 'age']).isRequired,
	sort_ascend: PropTypes.oneOf(['ascend', 'descend']).isRequired,
	query: PropTypes.string.isRequired,
	param_val: PropTypes.arrayOf(PropTypes.object).isRequired,
	handleChangeLanguage: PropTypes.func.isRequired,
	handleChangeSortParams: PropTypes.func.isRequired,
	handleChangeView: PropTypes.func.isRequired,
	handleChangeQuery: PropTypes.func.isRequired,
	translateWord: PropTypes.func.isRequired
}

export default HeaderComponent