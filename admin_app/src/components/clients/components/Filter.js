import React from 'react'

const Filter = (props) => {

    return (
        <div className="container-fluid">
            <div className="animated fadeIn">
                <div className="row">

                    <div className="form-group reservation-list-search col-md-2 col-sm-4 ">
                        <div className="form-group">
                            <label htmlFor="name">{props.translations.common.name}</label>
                            <input className={`form-control`} id="search_name" type="text" placeholder=""
                                name="search_name" onChange={props.onChange} value={props.search_name} />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Filter;