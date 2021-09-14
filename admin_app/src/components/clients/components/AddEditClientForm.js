import React, { Component } from 'react'
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, PRODUCT_IMG_URL } from '../../../constants.js'
import DeleteClientModal from './DeleteClientModal';
import MessagesContainer from '../../messages/MessagesContainer';
import Utils from '../../../utils/Utils.js';
import LangDropdown from './../../common/LangDropdown';
import Select from 'react-select'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class AddEditClientForm extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const props = this.props;

        let selectedParent;
        let autocompleteItems = [];
        autocompleteItems.push({ 'value': null, 'label': "Choose client" })

        // console.log( "AUTO ", autocompleteItems, props.clients)
        props.clients.map(cl => {
            if (props.client.clientId == cl.id) {
                selectedParent = { 'value': cl.id, 'label': cl.name };
            }

            // if(cat.active == 1) {

            autocompleteItems.push({ 'value': cl.id, 'label': cl.name });
            // } 
        });

        return (
            <form onSubmit={props.onSubmit}>
                <MessagesContainer />
                <div className="card-body">

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="name">{props.translations.common.name}</label>
                                <input className={`form-control`} id="name" type="text" clientholder={props.translations.common.name} name="name" onChange={props.onChange} value={props.client.name} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="slug">{props.translations.common.slug}</label>
                                <input className={`form-control`} id="slug" type="text" clientholder={props.translations.common.slug} name="slug" onChange={props.onChange} value={props.client.slug} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="owner_name">{props.translations.clients.owner_name}</label>
                                <input className={`form-control`} id="name" type="text" clientholder={props.translations.clients.owner_name} name="owner_name" onChange={props.onChange} value={props.client.owner_name} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="address">{props.translations.clients.address}</label>
                                <input className={`form-control`} id="address" type="text" clientholder={props.translations.common.address} name="address" onChange={props.onChange} value={props.client.address} />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <label className=" col-form-label">
                                {props.translations.clients.contract_start_date}
                            </label>

                            <DatePicker
                                className="form-control"
                                selected={props.client.contract_start_date}
                                onChange={date => props.onFieldChange('contract_start_date', date)}
                                dateFormat="d-M-Y"
                                style={{ display: 'block' }}
                            />
                        </div>

                        {/* <div className="col-md-4">
                            <label className=" col-form-label">
                                {props.translations.clients.monthly_fee}
                            </label>
                            <input className={`form-control`} id="monthly_fee" type="number" clientholder={props.translations.clients.monthly_fee} name="monthly_fee" onChange={props.onChange} value={props.client.monthly_fee} />
                        </div>

                   */}
                    </div>

                    <div className="row">
                        <div className="col-md-4">
                            <label className=" col-form-label">
                                {props.translations.clients.trial_start_date}
                            </label>

                            <DatePicker
                                className="form-control"
                                selected={props.client.trial_start_date}
                                onChange={date => props.onFieldChange('trial_start_date', date)}
                                dateFormat="d-M-Y"
                                style={{ display: 'block' }}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className=" col-form-label">
                                {props.translations.clients.trial_end_date}
                            </label>

                            <DatePicker
                                className="form-control"
                                selected={props.client.trial_end_date}
                                onChange={date => props.onFieldChange('trial_end_date', date)}
                                dateFormat="d-M-Y"
                                style={{ display: 'block' }}
                            />
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="address">{props.translations.clients.additional_info}</label>
                                <textarea className={`form-control`} id="address" type="text" clientholder={props.translations.clients.additional_info} name="additional_info" onChange={props.onChange}>
                                    {props.client.additional_info}
                                </textarea>
                            </div>
                        </div>
                    </div>

                    <div className=" row">
                        <label className="col-md-1 col-form-label">{props.translations.common.active}</label>
                        <div className="col-md-11 col-form-label">
                            <label className="switch switch-label switch-pill switch-outline-primary-alt">
                                <input className="switch-input" type="checkbox" name="active" onChange={props.onChangeCheckbox} checked={props.client.active} />
                                <span className="switch-slider" data-checked={props.translations.common.yes} data-unchecked={props.translations.common.no}></span>
                            </label>
                        </div>
                    </div>
                    {/* <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="address">{props.translations.clients.contract_start_date}</label>
                                <input className={`form-control`} id="contract_start_date" type="text" clientholder={props.translations.clients.contract_start_date} name="contract_start_date" onChange={props.onChange} value={props.client.contract_start_date} />
                            </div>
                        </div>
                    </div> */}
                    {/* 
                    <div className="row">
                        <div className="form-group col-sm-12">
                            <label htmlFor="parentId">{props.translations.common.client}</label>
                            <Select name="parentId" options={autocompleteItems} onChange={props.onChangeSelectAutocompleteItems} value={selectedParent} 
                                clientholder={"Client"}
                            />
                        </div>
                    </div> */}

                    <hr />
                    <br />

                    <div className="form-actions">
                        {props.isAdding == '1' ? '' : <button className="btn btn-danger mright10" type="button" data-toggle="modal" data-target={"#dangerModal" + props.client.id} >{props.translations.common.delete}</button>}


                        <DeleteClientModal
                            id={props.client.id}
                            name={props.client.name}
                            deleteClient={props.deleteClient}
                            translations={props.translations}
                        />

                        <NavLink to={ADMIN_URL + 'clients'}>
                            <button className="btn btn-secondary" type="button">
                                {props.translations.common.cancel}
                            </button>
                        </NavLink>

                        <button className="fright btn btn-primary" type="submit">
                            {props.isAdding == '1' ? props.translations.common.add : props.translations.common.save}
                            {/* {props.actionText} */}
                        </button>

                    </div>
                </div>
            </form>
        )
    }
}

export default AddEditClientForm;