import React from 'react'
import { NavLink } from 'react-router-dom';
import moment from 'moment';

const DateSelect = (props) => {
 
    let datesOptions = [];
    for (var i=0; i<10; i++) {
        var d = new Date();
        d.setDate(d.getDate() - i);
        var formatedDate = moment(d.toString()).format("DD.MM.YYYY");
        datesOptions.push(<option key={i} value={formatedDate}>{formatedDate}</option> )
    }

    return (
        <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
            <div className="form-group"> 
                <label htmlFor="name">{props.translations.common.date}</label>                
                <select className="form-control" name="search_date" defaultValue={props.search_date} onChange={props.onChange}>
                    <option key={0} value="">-</option>
                    {datesOptions}
                </select>
            </div>
        </div>
    )
}

export default DateSelect;