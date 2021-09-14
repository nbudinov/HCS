import React from 'react'
import DatePicker from 'react-datepicker';
import Select from 'react-select';

const Filter = (props) => {

    let usersOptions = [
        { 'value': '', 'label': 'Всички' }
    ];
    Object.values(props.users).map(user => {

        // if (cat.active == 1 && cat.deleted == 0) {
        //     let dashes = '';
        //     for (let i = 0; i < cat.hierarchyLevel - 1; i++) {
        //         dashes += "-";
        //     }

        usersOptions.push({ 'value': user.id, 'label': user.email });
    });

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <div className="row">

                    <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">
                            <label htmlFor="date">{props.translations.common.date}</label>
                            <br/>
                            <DatePicker
                                className="form-control vertical-center"
                                selected={props.search_date}
                                onChange={date => props.onFieldChange('search_date', date)}
                                dateFormat="d-M-Y"
                                style={{ display: 'block' }}
                            // onCalendarClose={handleCalendarClose}
                            // onCalendarOpen={handleCalendarOpen}
                            />
                        </div>
                    </div>

                    <div className="col-md-2 col-sm-4">
                        <div className="form-group">
                            <label htmlFor="parentId">{props.translations.common.user}</label>
                        
                            <Select
                                value={props.search_user}
                                name="colors"
                                options={usersOptions}
                                className="basic-multi-select"
                                classNamePrefix="select"
                                onChange={(valueLabel) => props.onFieldChange('search_user', valueLabel)}
                            // onChange={(values, { action, removedValue }) => props.ingredientsOnChange(values, { action, removedValue }, 'removable')}
                            />

                        </div>
                    </div>

                    {/* <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.common.user}</label>
                            <input className={`form-control`} id="search_name" type="text" placeholder=""
                                name="search_user" onChange={props.onChange} value={props.search_user} />
                        </div>
                    </div> */}

                    {/* <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.common.is_paying}</label>
                            <select className="form-control" name="search_is_paying" defaultValue={props.search_is_paying} onChange={props.onChange}>
                                <option key={0} value="">-</option>
                                <option value={1}>{props.translations.common.yes}</option>
                                <option value={2}>{props.translations.common.no}</option>
                            </select>
                        </div>
                    </div> */}
                    
                    <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">

                            <button className="btn btn-info" onClick={props.filter} style={{marginTop: 28}}>{props.translations.common.filter}</button>
                        </div>
                    </div>

                    {/* <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.common.status}</label>
                            <select className="form-control" name="search_active" defaultValue={props.search_active} onChange={props.onChange}>
                                <option key={0} value="">-</option>
                                <option value={1}>{props.translations.common.inactive}</option>
                                <option value={2}>{props.translations.common.active}</option>
                            </select>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    )
}

export default Filter;