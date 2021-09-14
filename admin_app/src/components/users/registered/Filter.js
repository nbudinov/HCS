import React from 'react'
import { NavLink } from 'react-router-dom';
import { Multiselect } from 'multiselect-react-dropdown';
import Auth from './../../../utils/Auth';
import Select from 'react-select'

import DatePicker from "react-datepicker";

const Filter = (props) => {
    // const [startDate, setStartDate] = useState(new Date());
    let placesOptions = [];
    let currPlace = props.places && props.places.find(p => p.id == Auth.getUserPlace()) || null;
    let currClientId = 0;
    if(currPlace) {
        currClientId = currPlace.clientId;
    }

    if(Auth.hasAccess("SUPER_ADMIN")) {
        placesOptions.push({ 'value': 'all',  'label': 'All' });
    }

    Object.values(props.places).map(place => {
        if (place.active == 1) {
            placesOptions.push({ 'value': place.id,  'label': place.name });
        }
    });

    return (
        // <div className="container-fluid p-0">
            // <div className="animated fadeIn">
                <div className="row">

                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="email">{props.translations.users.email}</label>
                            <input className={`form-control`} id="search_email" type="text" placeholder=""
                                name="search_email" onChange={props.onChange} value={props.search_email} />
                        </div>
                    </div>

                    <div className="col-md-3">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.common.status}</label>
                            <select className="form-control" name="search_active" defaultValue={props.search_active} onChange={props.onChange}>
                                <option key={0} value="">-</option>
                                <option value={1}>{props.translations.common.inactive}</option>
                                <option value={2}>{props.translations.common.active}</option>
                            </select>
                        </div>
                    </div>


                    {Auth.hasAccess("SUPER_ADMIN") ?
                        <div className="col-md-3">
                            <label htmlFor="place">{props.translations.common.place}</label>
                            <Select name="place" options={placesOptions} placeholder={""}
                                onChange={(valueLabel) => props.onChangeSelectAutocomplete('filter_place', valueLabel)} 
                            />
                        </div>
                    :
                        null
                    }
                    
                    <hr/>
                </div>
            // </div>
        // </div>
    )
}

export default Filter;