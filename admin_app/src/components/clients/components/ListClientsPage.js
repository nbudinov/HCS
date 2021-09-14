import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'

import { listClients, addEditClient } from '../actions/clients.actions';
import ListEachClient from './ListEachClient';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED } from '../../../constants.js'
import Pagination from "react-js-pagination";
import { push } from 'react-router-redux';
import Filter from './Filter';
import MessagesContainer from '../../messages/MessagesContainer';
import { translations } from '../../common/translations';

class ListClientsPage extends Component {
    constructor(props) {
        super(props);
        this.activeDefaultLanguage = 'bg'; // TODO add it in db
        this.state = {
            search_name: '',
            search_active: '',
        }
    }

    componentWillMount() {
        // this.props.listClients();
    }

    deleteClient = (e, id) => {
        e.preventDefault();
        this.props.addEditClient({ id: id, deleted: true });
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/clients?page=' + page))
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.handlePageChange(1);
    }

    onChangeCheckbox = (e, id) => {
        // e.preventDefault();
        // this.props.addEditClient({ id: id, is_paying: e.target.checked });
    }

    render() {
        let clients = this.props.items;

        if (this.state.search_name.length > 0
            // || this.state.search_active != 0
        ) {
            clients = Object.values(clients).filter(i => {
                return (
                    ((i.name).toLocaleLowerCase().includes((this.state.search_name).toLocaleLowerCase()))
                    // && (this.state.search_active != 0 ? i.active == Boolean(parseInt(this.state.search_active) - 1) : true)
                )
            })
        }

        const items_count = (clients).length
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * ITEMS_PER_PAGE;
        let start_count = 0;

        return (
            <main className="main">

                {/* <!-- Breadcrumb--> */}
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
                    {/* <li className="breadcrumb-item">Меню</li> */}
                    <li className="breadcrumb-item active">{this.props.translations.clients.title}</li>
                    {/* <!-- Breadcrumb Menu--> */}
                    <li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                            <button onClick={() => { window.localStorage.clear(); window.location.reload() }} className="btn btn-default">Clear Local</button>
                            <NavLink to={ADMIN_URL + `clients/add`} className="btn" >
                                <i className="fas fa-plus"></i> &nbsp; {this.props.translations.clients.add}
                            </NavLink>
                            {/* 
                            <!--<a className="btn" href="./">
                                <i className="icon-graph"></i>  Dashboard</a>
                            <a className="btn" href="#">
                                <i className="icon-settings"></i>  Settings</a>
                            --> 
                            */}
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
                                                    <th>{this.props.translations.common.slug}</th>
                                                    <th>{this.props.translations.clients.contract_start_date}</th>
                                                    {/* <th>{this.props.translations.clients.monthly_fee}</th>
                                                     */}
                                                    {/* <th>{this.props.translations.common.icon}</th> */}
                                                    <th>{this.props.translations.common.action}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {(clients).map((client, index) => {
                                                    if (index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                        start_count++;
                                                        return <ListEachClient
                                                            key={client.id}
                                                            client={client}
                                                            deleteClient={this.deleteClient}
                                                            // activeDefaultLanguage={this.activeDefaultLanguage}
                                                            translations={this.props.translations}
                                                            currLang={this.props.currLang}
                                                            onChangeCheckbox={(e) => this.onChangeCheckbox(e, client.id)}
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
        items: state.clients.clients || [],
        page: Number(state.router.location.query.page) || 1,
        translations: state.lang,
        currLang: "bg",
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ addEditClient, listClients }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListClientsPage);
