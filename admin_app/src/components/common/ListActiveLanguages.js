import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../constants'

const ListActiveLanguages = (props) => (

    Object.keys(props.activeLanguages).map((key, index) => {
        return <p key={key} className={`btn active-languages lng-${props.activeLanguages[key].id} ${props.activeLanguages[key].id === props.selectedLanguage ? 'active' : ''}`} onClick={() => props.setActiveLanguage(props.activeLanguages[key].id, props.activeLanguages[key].code)}>
            <i className={`flag-icon flag-icon-${props.activeLanguages[key].icon_code}`} id={props.activeLanguages[key].code} title={props.activeLanguages[key].code.toUpperCase()}></i>
            &nbsp; {props.activeLanguages[key].code.toUpperCase()}
        </p>
    })

)

export default ListActiveLanguages;