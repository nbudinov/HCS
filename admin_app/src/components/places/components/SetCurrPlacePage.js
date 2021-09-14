import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavLink } from 'react-router-dom';
import Pagination from "react-js-pagination";
import { push } from 'react-router-redux';
import { listPlacesByUserRole } from './../actions/places.actions';

import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED, FILTER_PLACES_NAME } from '../../../constants';
import MessagesContainer from './../../messages/MessagesContainer';
import queryString from 'query-string'
import Select from 'react-select'
import Auth from './../../../utils/Auth';

class SetCurrPlacePage extends Component {
    constructor(props){
        super(props);
    }

    componentWillMount() {
        this.props.listPlacesByUserRole()
    }
    
    handlePageChange = (page) => {
        // this.props.dispatch(push('/admin/settings?page='+page))
    }

	onChangeSelectAutocompletePlace = (valueLabel) => {
        Auth.setUserPlace(valueLabel.value);
        window.localStorage.setItem(FILTER_PLACES_NAME, JSON.stringify([valueLabel.value]));

        document.location.href = document.location.href;
	}

    render() {

        let autocompletePlaces = [];
        let selectedPlace = {};
        
        this.props.places.map(place => {
            if (Auth.getUserPlace() == place.id) {
                selectedPlace = { 'value':place.id, 'label': place.name} ;
            }
            
            // if(place.active == 1) {                
                autocompletePlaces.push( {'value': place.id, 'label': place.name} );
            // } 
        });

        return (
            <React.Fragment>
                <main className="main">
                    
                    <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
                        <li className="breadcrumb-item active">{this.props.translations.sidemenu.places}</li>
                    </ol>
    
                    <div className="container-fluid">
                        <div className="animated fadeIn">
                            <div className="row">
                        
                                <div className="col-lg-12">
                                    <div className="card">
                                        
                                        <div className="card-body">
                                            
                                            <MessagesContainer/>

                                            <Select name="parentId" options={autocompletePlaces} 
                                                onChange={this.onChangeSelectAutocompletePlace} 
                                                value={selectedPlace} 
                                                // placeholder={"Основна категория (родител)"}
                                            />

                                            <br/>
                                            <hr/>

                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                </main>

            </React.Fragment>

        )
    }
}

const mapStateToProps = (state, dispatch) => {

    return {
        currUser: state.auth.user || [],
        places: state.places.places,
        translations: state.lang,

    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ listPlacesByUserRole }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(SetCurrPlacePage);
