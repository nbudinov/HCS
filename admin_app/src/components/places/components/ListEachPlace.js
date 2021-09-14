import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, IMG_PATH } from '../../../constants.js'
import DeletePlaceModal from './DeletePlaceModal';
import Utils from '../../../utils/Utils';
import Auth from '../../../utils/Auth.js';

const ListEachPlace = (props) => (
    <tr key={props.place.id}>
        <td>
            {props.place.name}
        </td>

        <td>
            <NavLink to={ADMIN_URL + 'places/edit/' + props.place.id}>
                <button className="btn btn-pill btn-link" type="button">
                    <i className="fas fa-edit"></i>
                </button>
            </NavLink>

            <button className="btn btn-pill btn-link" type="button" data-toggle="modal" data-target={"#dangerModal" + props.place.id} >
                <i className="fas fa-trash"></i>
            </button>

            <DeletePlaceModal
                id={props.place.id}
                name={props.place.name}
                deletePlace={props.deletePlace}
                translations={props.translations}
            />

        </td>
    </tr>
)

export default ListEachPlace;