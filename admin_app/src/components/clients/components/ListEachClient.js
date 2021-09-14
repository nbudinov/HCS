import React from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, IMG_PATH } from '../../../constants.js'
import DeleteClientModal from './DeleteClientModal';
import Utils from '../../../utils/Utils';
import moment from 'moment';
import Auth from '../../../utils/Auth.js';

const ListEachClient = (props) => (
    <tr key={props.client.id}>
        <td>
            {/* If not added translation for the defailt language */}
            {props.client.name}
            {/* {props.alergen.translations[props.currLang] && props.alergen.translations[props.currLang].name 
			? props.alergen.translations[props.currLang].name : props.alergen.name} */}
        </td>
        <td>
            <a href={`https://menu.tabl.bg/${props.client.slug || ''}`} target="blank">{props.client.slug || '-'}</a>
        </td>
        <td>
            {props.client.contract_start_date && moment(props.client.contract_start_date).format('DD-MM-YYYY') || '-'}
        </td>
        {/* <td>
            {Auth.hasAccess('SUPER_ADMIN') ? props.client.monthly_fee : '-'}
        </td>
        <td>
            {Auth.hasAccess('SUPER_ADMIN') ?
                <div className="col-md-2 col-form-label">
                    <label className="switch switch-label switch-pill switch-outline-primary-alt">
                        <input className="switch-input" type="checkbox" name="is_paying" onChange={(e) => window.confirm('Are you sure you want to edit payment method for client: ' + props.client.name + ' ?') ? props.onChangeCheckbox(e) : void (0)} checked={props.client.is_paying} />
                        <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                    </label>
                </div>
                :
                '-'
            }
        </td> */}
        {/* <td>
            {props.clients.image ? <img style={{ maxHeight: 100 }} src={Utils.getCategoryImagePath(props.alergen.image)} /> : ""}
        </td> */}
        <td>
            <NavLink to={ADMIN_URL + 'clients/edit/' + props.client.id}>
                <button className="btn btn-pill btn-link" type="button">
                    <i className="fas fa-edit"></i>
                </button>
            </NavLink>

            {/* <button className="btn btn-pill btn-link" type="button" data-toggle="modal" data-target={"#dangerModal" + props.client.id} >
                <i className="fas fa-trash"></i>
            </button> */}

            <DeleteClientModal
                id={props.client.id}
                name={props.client.name}
                deleteClient={props.deleteClient}
                translations={props.translations}
            />

        </td>
    </tr>
)

export default ListEachClient;