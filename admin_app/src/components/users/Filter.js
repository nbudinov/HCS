import React from 'react'

const Filter = (props) => {

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <div className="row">

                    <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">
                            <label htmlFor="email">{props.translations.users.email}</label>
                            <input className={`form-control`} id="search_email" type="text" placeholder=""
                                name="search_email" onChange={props.onChange} value={props.search_email} />
                        </div>
                    </div>

                    <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.common.status}</label>
                            <select className="form-control" name="search_active" defaultValue={props.search_active} onChange={props.onChange}>
                                <option key={0} value="">-</option>
                                <option value={1}>{props.translations.common.inactive}</option>
                                <option value={2}>{props.translations.common.active}</option>
                            </select>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Filter;