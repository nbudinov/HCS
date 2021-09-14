import React, { Component } from 'react'
import { connect } from 'react-redux';
import { listUsers, editUser, listUserRoles } from '../../actions/usersActions';
import ListEachUser from './ListEachUser';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED } from '../../constants.js'
import Pagination from "react-js-pagination";
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux'
import Filter from './Filter';

class ListUsersPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            search_email: '',
            search_active: '',
        }
    }

    componentWillMount() {
        this.props.listUsers();
        this.props.listUserRoles();
    }

    deleteUser = (e, id, email) => {
        e.preventDefault();
		let post = {id: id, email: email, deleted:true};
		this.props.editUser(id, post, this.props.history);
        // this.props.editUser(id);
        this.props.listUsers();
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.handlePageChange(1);
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/users?page='+page))
    }

    render() {
        let userItems = this.props.users;

        if (this.state.search_email.length > 0
            || this.state.search_active != 0
        ) {
            userItems = Object.values(userItems).filter(i => {
                return (
                    ((i.email).toLocaleLowerCase().includes((this.state.search_email).toLocaleLowerCase()))
              
                    && (this.state.search_active != 0 ? i.active == Boolean(parseInt(this.state.search_active) - 1) : true)
                )
            })
        }

        const items_count = Object.keys(userItems).length
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * ITEMS_PER_PAGE;
        let start_count = 0; 

        return (
            <main className="main">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.translations.sidemenu.users}</li>
                    <li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                            <NavLink to={ADMIN_URL+`users/add`} className="btn" >
                                <i className="fas fa-plus"></i> &nbsp; {this.props.translations.users.add}
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
                                users={this.props.users}
                            />

                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <table className="table table-responsive-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>{this.props.translations.users.email}</th>
                                                    <th>{this.props.translations.common.role}</th>
                                                    <th>{this.props.translations.common.status}</th>
                                                    <th>{this.props.translations.common.action}</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {Object.values(userItems).map((u, index) => {
                                                    if(index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                        start_count++;
                                                        return <ListEachUser 
                                                        key={u.id} 
                                                        user={u} 
                                                        deleteUser={this.deleteUser}
                                                        translations={this.props.translations}
                                                        roles={this.props.roles}
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
                        </div>
                    </div>
                </div>
            </main>
        )
    }
}

const mapStateToProps = (state, dispatch) => {
    return {
        users: state.users.users || [],
        page: Number(state.router.location.query.page) || 1,
        translations: state.lang,
        roles: state.users.roles,
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ listUsers, editUser, listUserRoles }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(ListUsersPage);
