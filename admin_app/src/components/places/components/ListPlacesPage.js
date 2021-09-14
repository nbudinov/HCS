import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { listPlacesByUserRole, addEditPlace, initPlaceSettings, initSettingsForAllPlaces } from '../actions/places.actions';
import ListEachPlace from './ListEachPlace';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED } from '../../../constants.js'
import Pagination from "react-js-pagination";
import { push } from 'react-router-redux';
// import Filter from './Filter';
import MessagesContainer from '../../messages/MessagesContainer';
import { translations } from '../../common/translations';
import Filter from './Filter';

class ListPlacesPage extends Component {
    constructor(props) {
        super(props);
        this.activeDefaultLanguage = 'bg'; // TODO add it in db
        this.state = {
            search_name: '',
            search_active: '',
        }
    }

    componentWillMount() {
        this.props.listPlacesByUserRole();
    }

    deletePlace = (e, id) => {
        e.preventDefault();
        this.props.addEditPlace({ id: id, deleted: true });
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/places?page=' + page))
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.handlePageChange(1);
    }

    onChangeCheckbox = (e, id) => {
        e.preventDefault();
        this.props.addEditPlace({ id: id, is_paying: e.target.checked });
        this.props.listPlacesByUserRole();
    }

    render() {
        let places = this.props.items;

        if (this.state.search_name.length > 0
            // || this.state.search_active != 0
        ) {
            places = Object.values(places).filter(i => {
                return (
                    ((i.name).toLocaleLowerCase().includes((this.state.search_name).toLocaleLowerCase()))
                    // && (this.state.search_active != 0 ? i.active == Boolean(parseInt(this.state.search_active) - 1) : true)
                )
            })
        } else if (this.state.search_is_paying == 1) {
            places = Object.values(places).filter(i => i.is_paying == 1)
        } else if (this.state.search_is_paying == 2) {
            places = Object.values(places).filter(i => i.is_paying == 0)
        } else if ((this.state.search_name.length > 0) && (this.state.search_is_paying == 1)) {
            places = Object.values(places).filter(i => {
                return (
                    i.is_paying == 1 && ((i.name).toLocaleLowerCase().includes((this.state.search_name).toLocaleLowerCase()))
                    // && (this.state.search_active != 0 ? i.active == Boolean(parseInt(this.state.search_active) - 1) : true)
                )
            })
        }

        const items_count = (places).length
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * ITEMS_PER_PAGE;
        let start_count = 0;

        return (
            <main className="main">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.translations.places.title}</li>
                    <li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                            <NavLink to={ADMIN_URL + `places/add`} className="btn" >
                                <i className="fas fa-plus"></i> &nbsp; {this.props.translations.places.add}
                            </NavLink>
                        </div>
                    </li>
                </ol>

                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <div className="row">

                            <Filter
                                translations={this.props.translations}
                                onChange={this.onChange}
                            />

                            {/* <!-- /.col--> */}
                            <div className="col-lg-12">
                                <div className="card">

                                    <div className="card-body">

                                        <MessagesContainer />

                                        <table className="table table-responsive-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>{this.props.translations.common.name}</th>
                                                    <th>{this.props.translations.common.action}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {(places).map((place, index) => {
                                                    if (index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                        start_count++;
                                                        return <ListEachPlace
                                                            key={place.id}
                                                            place={place}
                                                            deletePlace={this.deletePlace}
                                                            translations={this.props.translations}
                                                            currLang={this.props.currLang}
                                                            initPlaceSettings={this.props.initPlaceSettings}
                                                            onChangeCheckbox={(e) => this.onChangeCheckbox(e, place.id)}
                                                        />
                                                    }
                                                })}

                                            </tbody>
                                        </table>

                                        <Pagination
                                            className="pagination"
                                            itemClass="page-item"
                                            activePage={current_page}
                                            activeClass="active"
                                            linkClass="page-link"
                                            prevPageText="<"
                                            nextPageText=">"
                                            firstPageText="<<"
                                            lastPageText=">>"
                                            itemsCountPerPage={ITEMS_PER_PAGE}
                                            totalItemsCount={items_count}
                                            pageRangeDisplayed={ITEMS_PAGE_RANGE_DISPLAYED}
                                            onChange={this.handlePageChange}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* <!-- /.col--> */}
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        items: state.places.places || [],
        page: Number(state.router.location.query.page) || 1,
        translations: state.lang,
        currLang: "bg",
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ listPlacesByUserRole, addEditPlace, initPlaceSettings, initSettingsForAllPlaces }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListPlacesPage);
