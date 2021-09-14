import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../constants.js'
import DeleteUserModal from './DeleteUserModal.js';

const ListEachUser = (props) => {
    if (props.user.email !== 'demo@tabl.bg') {
        let userRole = "";
        let role = props.roles && props.roles.find(r => r.id == props.user.roleId) || null;
        if(role) {
            userRole = role.name && props.translations.roles[role.name] || "---";
        }

        return (
            <tr key={props.user.id}>
                <td>
                    {props.user.email}
                </td>
                <td>
                    {userRole}
                </td>
                <td>
                    {props.user.active ? <span className="badge badge-success">{props.translations.common.active}</span> : <span className="badge badge-secondary">{props.translations.common.inactive}</span>}
                </td>
                <td>
                    <NavLink to={ADMIN_URL+'users/edit/' + props.user.id}>
                        <button className="btn btn-pill btn-link" type="button">
                            <i className="fas fa-edit"></i>
                        </button>
                    </NavLink>
                    
                    <button className="btn btn-pill btn-link" type="button" data-toggle="modal" data-target={"#dangerModal" + props.user.id} >
                        <i className="fas fa-trash"></i>
                    </button>

                    <DeleteUserModal
                        userId={props.user.id}
                        userEmail={props.user.email}
                        deleteUser={props.deleteUser}
                    />

                </td>
            </tr>
        )
    } else {
        return (<React.Fragment></React.Fragment>)
    }
}

export default ListEachUser;