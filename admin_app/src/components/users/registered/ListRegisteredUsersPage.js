import React, { Component } from 'react'
import { connect } from 'react-redux';
import { getRegisteredUsers } from '../../../actions/usersActions';
import ListEachRegisteredUser from './ListEachRegisteredUser';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED } from '../../../constants.js'
import Pagination from "react-js-pagination";
import { push } from 'react-router-redux';
import { bindActionCreators } from 'redux'
import Filter from './Filter';

class ListRegisteredUsersPage extends Component {
    constructor(props){
        super(props);

        this.state = {
            search_email: '',
            search_active: '',
            filter_place: null,

        }
    }
  
    componentWillMount() {
        this.props.getRegisteredUsers();
        // this.props.listUserRoles();
    }

    componentsWillReceiveProps(nextProps) {

    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.handlePageChange(1);
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/users/registered?page='+page))
    }

    onChangeSelectAutocomplete = (fieldName, valueLabel) => {
        this.setState({ [fieldName]: valueLabel.value });
        let placeId = valueLabel.value;
        this.props.getRegisteredUsers(placeId);
        
	}

    render() {
        let userItems = this.props.registered_users;

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
                    
                {/* <!-- Breadcrumb--> */}
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
                    <li className="breadcrumb-item active">{this.props.translations.users.registered_users}</li>
                </ol>

                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <Filter
                            translations={this.props.translations}
                            onChange={this.onChange}
                            onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
                            users={this.props.users}
                            places={this.props.places}
                        />
                        <div className="row">
                            

                            {/* <!-- /.col--> */}
                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <b>Total:</b> {Object.keys(userItems).length}
                                    
                                        <table className="table table-responsive-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>{this.props.translations.users.date_of_registration}</th>
                                                    <th>{this.props.translations.users.email}</th>
                                                    <th>{this.props.translations.users.fullname}</th>
                                                    <th>{this.props.translations.users.phone}</th>
                                                    <th>{this.props.translations.users.address}</th>
                                                    <th>{this.props.translations.common.status}</th>
                                                    <th>{this.props.translations.common.orders}</th>
                                                    {/* <th>{this.props.translations.common.action}</th> */}
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {Object.values(userItems).map((u, index) => {
                                                    if(index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                        start_count++;
                                                        return <ListEachRegisteredUser
                                                            key={u.id} 
                                                            user={u}
                                                            translations={this.props.translations}
                                                            settings={this.props.settings}
                                                            all_products={this.props.products}
                                                            categoriesHierarchy={this.props.categoriesHierarchy}
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
        registered_users: state.users.registered_users || [],
        page: Number(state.router.location.query.page) || 1,
        translations: state.lang,
        roles: state.users.roles,
        products: state.products.products || [],
        categoriesHierarchy: state.categoriesHierarchy.categories || [],
        places: state.places.places || [],
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ getRegisteredUsers }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(ListRegisteredUsersPage);
