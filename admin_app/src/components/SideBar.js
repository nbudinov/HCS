import React, { Component } from 'react'
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../constants.js'
import Auth from './../utils/Auth';

import Cookies from 'universal-cookie';
import Utils from '../utils/Utils';
import { FaUserAlt, FaLocationArrow, FaTasks, FaBuilding } from "react-icons/fa";

const cookies = new Cookies();



class SideBar extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const { settings } = this.props;

		let currPlace = this.props.places.find(p => p.id == Auth.getUserPlace());
		let currPlaceName = currPlace ? currPlace.name : "-";

		const currPlaceOrderTypes = currPlace ? currPlace.ordertypes : []
		// console.log('currPlaceOrderTypes', currPlaceOrderTypes)
		// if(cookies.get('tabl_place') != placeId) { // on refresh - if place is different - clear cart

		// console.log('currPlace', currPlace)
		return (
			<div className="sidebar">
				<nav className="sidebar-nav">
					<ul className="nav">
						<li className="divider"></li>

						{Auth.hasAccess("USER") ?
							<>
								<li className="nav-item">
									<NavLink to={`/my-tasks`} className="nav-link">
										<i className="nav-icon "><FaTasks/></i> {this.props.translations.sidemenu.my_tasks}</NavLink>

								</li>
							</>
						:
							null
						}
						{Auth.hasAccessCustom(['PLACE_ADMIN', 'CLIENT_ADMIN', 'SUPER_ADMIN']) ?
							<React.Fragment>

								<li className="divider"></li>
								<li className="nav-title">
									{this.props.translations.sidemenu.admin}
								</li>

								<li className="nav-item">
									<NavLink to={ADMIN_URL + `tasks`} className="nav-link">
										<i className="nav-icon "><FaTasks/></i> {this.props.translations.sidemenu.tasks}</NavLink>

								</li>

								<li className="nav-item">
									<NavLink to={ADMIN_URL + `checkpoints`} className="nav-link">
										<i className="nav-icon"><FaLocationArrow/></i> {this.props.translations.sidemenu.checkpoints}</NavLink>

								</li>

							</React.Fragment>
							:
							null
						}


						{Auth.hasAccess("CLIENT_ADMIN") && this.props.places.length > 1 ?
							<li className="nav-item">
								<NavLink to={ADMIN_URL + `places/current`} className="nav-link">
									<i className="nav-icon "><FaBuilding/></i>  {this.props.translations.sidemenu.current_place} <span className="badge badge-secondary current-place-sidebar">{currPlaceName}</span>
								</NavLink>
							</li>
							:
							null
						}

						{Auth.hasAccess("PLACE_ADMIN") ?
							<li className="nav-item">
								<NavLink to={ADMIN_URL + `users`} className="nav-link">
									<i className="nav-icon "><FaUserAlt/></i>   {this.props.translations.sidemenu.users} 
								</NavLink>
							</li>
						:
							null
						}


						{Auth.hasAccess("SUPER_ADMIN") ?
							<React.Fragment>
								<li className="divider"></li>
								<li className="nav-title">
									{this.props.translations.sidemenu.super_admin}
								</li>
								<li className="nav-item">
									<NavLink to={ADMIN_URL + `places`} className="nav-link">
										<i className="nav-icon"><FaBuilding/></i>  {this.props.translations.sidemenu.places}
									</NavLink>
								</li>

							</React.Fragment>
							:
							null
						}

					</ul>
				</nav>
				<button className="sidebar-minimizer brand-minimizer" type="button"></button>
			</div >
		)
	}
}

const mapStateToProps = state => {

	return {
		translations: state.lang,
		userRole: state.auth.user.role || "",
		places: state.places.places || []
	}
};


export default connect(mapStateToProps)(SideBar);