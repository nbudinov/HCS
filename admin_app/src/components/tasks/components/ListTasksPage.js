import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { listAllTasks, addEditTask } from '../actions/tasks.actions';
import { listUsers } from '../../../actions/usersActions';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED } from '../../../constants.js'
import Pagination from "react-js-pagination";
import { push } from 'react-router-redux';
import MessagesContainer from '../../messages/MessagesContainer';
import Filter from './Filter';
import ListEachTask from './ListEachTask';
import VisitDetailsModal from './VisitDetailsModal';
import moment from 'moment';

class ListTasksPage extends Component {
    constructor(props) {
        super(props);
        this.activeDefaultLanguage = 'bg'; // TODO add it in db
        this.state = {
            search_date: moment().toDate(),
            search_user: '',
            visitDetailsModalOpened: false,
            clickedTask: '',
            clickedUser: '',
        }
    }

    componentWillMount() {
        this.props.listAllTasks();
        this.props.listUsers();
    }

    deleteTask = (e, id) => {
        e.preventDefault();
        this.props.addEditTask({ id: id, deleted: true });
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/tasks?page=' + page))
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
        this.handlePageChange(1);
    }

    onFieldChange = (fieldName, value) => {
		this.setState({ [fieldName]: value });
	}

    onChangeCheckbox = (e, id) => {
        e.preventDefault();
        this.props.addEditTask({ id: id, is_paying: e.target.checked });
        this.props.listTasksByUserRole();
    }

    filter = () => {
        this.props.listAllTasks(this.state.search_date, this.state.search_user && this.state.search_user.value || null);
    }

    openVisitDetailsModal = (task, user) => {
        this.setState({clickedTask: task, clickedUser: user, visitDetailsModalOpened: true});
        console.log(task, user);
    }

    render() {
        let tasks = Object.values(this.props.items);
        const items_count = (tasks).length
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * ITEMS_PER_PAGE;
        let start_count = 0;

        return (
            <main className="main">
                <ol className="breadcrumb">
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.translations.tasks.title}</li>
                    <li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                        </div>
                    </li>
                </ol>

                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <div className="row">

                            <Filter
                                translations={this.props.translations}
                                onChange={this.onChange}
                                onFieldChange={this.onFieldChange}
                                search_date={this.state.search_date}
                                filter={this.filter}
                                users={this.props.users}
                            />

                            <div className="col-lg-12">
                                <div className="card">
                                    <div className="card-body">
                                        <MessagesContainer />
                                        <table className="table table-responsive-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>{this.props.translations.common.name}</th>
                                                    <th>{this.props.translations.common.description}</th>
                                                    <th>{this.props.translations.tasks.checkpoint}</th>
                                                    <th>{this.props.translations.common.user}</th>
                                                    <th>{this.props.translations.common.action}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {Object.values(tasks).map((task, index) => {
                                                    if (index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                        start_count++;
                                                        return <ListEachTask
                                                            key={task.id}
                                                            task={task}
                                                            deleteTask={this.deleteTask}
                                                            onFieldChange={this.onFieldChange}
                                                            openVisitDetailsModal={this.openVisitDetailsModal}
                                                            translations={this.props.translations}
                                                            currLang={this.props.currLang}
                                                        />
                                                    }
                                                })}

                                            </tbody>
                                        </table>

                                        <VisitDetailsModal
                                            isOpened={this.state.visitDetailsModalOpened}
                                            onClose={() => this.setState({visitDetailsModalOpened: false})}
                                            task={this.state.clickedTask}
                                            user={this.state.clickedUser}
                                        />

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
        items: state.tasks.tasks || [],
        users: state.users.users || [],
        page: Number(state.router.location.query.page) || 1,
        translations: state.lang,
        currLang: "bg",
    }
};

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ listAllTasks, addEditTask, listUsers}, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListTasksPage);
