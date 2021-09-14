import React from 'react'
import { NavLink } from 'react-router-dom';

const Breadcrumb = (props) => {
 
    return (
        <ol className="breadcrumb">
                <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
                    <li className="breadcrumb-item active">{this.props.translations.sidemenu.orders}</li>
                    {/* <!-- Breadcrumb Menu--> */}
                    <li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                            {/* <NavLink to={ADMIN_URL+`categories/add`} className="btn" >
                                <i className="fas fa-plus"></i> &nbsp; Добавяне на категория
                            </NavLink> */}
                            {/* 
                            <!--<a className="btn" href="./">
                                <i className="icon-graph"></i>  Dashboard</a>
                            <a className="btn" href="#">
                                <i className="icon-settings"></i>  Settings</a>
                            --> 
                            */}
                        </div>
                    </li>
                </ol>
    )
}

export default Breadcrumb;