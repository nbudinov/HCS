import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../constants.js'
import DeleteUserModal from './DeleteUserModal.js';
import MessagesContainer from './../messages/MessagesContainer';
import Auth from './../../utils/Auth';

const AddEditUserForm = (props) => {

    let selectedRole;
    const roles = [];
    props.roles.map(r => {
        if (props.roleId == r.id) {
            selectedRole = r.id;
        }
        // TODO: скрий по-големите роли ролята от current lognatiq user 
        // if (Auth.getDecodedUser().roleId <= r.id && r.name != "USER" && r.name != "SUPER_ADMIN" && r.name != "PDF_MENU_ADMIN" && r.name != "RASPBERRY_ADMIN") {
            roles.push(<option key={r.id} value={r.id}>{props.translations.roles[r.name] || "---"}</option>);
        // }
// 
        // if(r.name != "USER" && r.name != "SUPER_ADMIN") {
        // }
    })

    let selectedPlace;
    const placesRows = props.places.map(p => {
        if (props.userPlaceId == p.id) {
            selectedPlace = p.id;
        }

        return <option key={p.id} value={p.id}>{p.name}</option>
    })

    return (
        <form onSubmit={props.onSubmit}>
            <MessagesContainer />

            <div className="card-body">

                <div className="row">
                    <div className="col-sm-12">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.users.email}</label>
                            <input className={`form-control`} id="name" type="text" placeholder="" name="email" onChange={props.onChange} value={props.userEmail} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-sm-12">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.users.password}</label>
                            <input className={`form-control`} id="name" type="text" placeholder="" name="password" onChange={props.onChange} />
                        </div>
                    </div>
                </div>

                <div className="row">
                    <label className="col-md-1 col-form-label">{props.translations.common.active}</label>
                    <div className="col-md-11 col-form-label">
                        <label className="switch switch-label switch-pill switch-outline-primary-alt">
                            <input className="switch-input" type="checkbox" name="active" onChange={props.onChangeCheckbox} checked={props.userActive} />
                            <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                        </label>
                    </div>
                </div>

                <div className="row">
                    <label className="col-md-1 col-form-label">{props.translations.common.role}</label>
                    <div className="col-md-11 col-form-label">
                        <select className="form-control" name="role" onChange={props.onChange} value={selectedRole}>
                            <option key={0} value={0}>-</option>
                            {roles}
                        </select>
                        {/* <label className="switch switch-label switch-pill switch-outline-primary-alt">
                            <input className="switch-input" type="checkbox"  name="active" onChange={props.onChangeCheckbox} checked={props.userActive}/>
                            <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                        </label> */}
                    </div>
                </div>

                <div className="row">
                    <label className="col-md-1 col-form-label">{props.translations.common.place}</label>
                    <div className="col-md-11 col-form-label">
                        <select className="form-control" name="placeId" onChange={props.onChange} value={selectedPlace}>
                            <option key={0} value={0}>-</option>
                            {placesRows}
                        </select>
                        {/* <label className="switch switch-label switch-pill switch-outline-primary-alt">
                            <input className="switch-input" type="checkbox"  name="active" onChange={props.onChangeCheckbox} checked={props.userActive}/>
                            <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                        </label> */}
                    </div>
                </div>

                <hr />
                <br />

                <div className="form-actions">
                    {props.isAddingUser == '1' ? '' : <button className="btn btn-danger mright10" type="button" data-toggle="modal" data-target={"#dangerModal" + props.userId} >{props.translations.common.delete}</button>}

                    <DeleteUserModal
                        userId={props.userId}
                        userEmail={props.userEmail}
                        deleteUser={props.deleteUser}
                    />

                    <NavLink to={ADMIN_URL + 'users'}>
                        <button className="btn btn-secondary" type="button">
                            {props.translations.common.cancel}
                        </button>
                    </NavLink>

                    <button className="fright btn btn-primary" type="submit">
                        {props.isAddingUser == '1' ? props.translations.common.add : props.translations.common.edit}
                    </button>

                </div>

            </div>

        </form>
    )
}

export default AddEditUserForm;