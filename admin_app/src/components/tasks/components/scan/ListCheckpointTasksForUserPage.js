import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import { addErrorMessages, addSuccessMessage } from './../../../messages/messages.actions';
import { listCheckpoints, addEditCheckpoint } from '../../../checkpoints/actions/checkpoints.actions';
import { listAllTasks, listUserTasks } from './../../../tasks/actions/tasks.actions';
import { openConfirmModal } from './../../../../actions/adminActions';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED, ADMIN_QR_CODE_DATA } from '../../../../constants.js'
import ListEachTaskForUser from './ListEachTaskForUser';
import Pagination from "react-js-pagination";
import MessageContainer from './../../../messages/MessagesContainer';
import ReactExport from "react-export-excel";
import QRCodeStyling from "qr-code-styling";

class ListCheckpointTasksForUserPage extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.listUserTasks(this.props.token);
        this.props.listCheckpoints();
    }

    deleteTask = (e, id) => {
        e.preventDefault();
        const post = {
			id: id,
			deleted: 1,
		}

		this.props.addEditTask(post)
		.then(resp => {
            this.props.listCheckpoints();
			this.props.addSuccessMessage("Успешно изтрихте задача")
		})
		.catch(error => {
			this.props.addErrorMessages(error.response.data.error.errors);
		})
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/checkpoints/' + this.props.checkpointId + '/tasks?page=' + page))
    }

    render() {
        let itemsList = this.props.tasksForCheckpoint;

        const items_count = Object.keys(itemsList).length
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * ITEMS_PER_PAGE;
        let start_count = 0;

        return (
            <main className="main">

                {/* <!-- Breadcrumb--> */}
                <ol className="breadcrumb">
                    {/* <li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "checkpoints"}>{this.props.translations.checkpoints.title}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.checkpoint && this.props.checkpoint.name || ""}</li>
                    <li className="breadcrumb-item active">{this.props.translations.checkpoints.tasks_for_checkpoint}</li> */}
                    
                    
                   
                </ol>


                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <div className="row">

                            {/* <!-- /.col--> */}
                            <div className="col-lg-12">
                                <div className="card">

                                    <MessageContainer />

                                    <div className="card-body">
                                        <table className="table table-responsive-sm table-striped">
                                            <thead>
                                                <tr>
                                                    <th>{this.props.translations.common.name}</th>
                                                    <th>{this.props.translations.tasks.description}</th>
                                                    <th>{this.props.translations.tasks.rotation_start_date}</th>
                                                    <th>{this.props.translations.tasks.rotation_days_count}</th>
                                                    <th>{this.props.translations.tasks.times_per_day_of_task_execution}</th>
                                                    <th>{this.props.translations.common.action}</th>
                                                </tr>
                                            </thead>
                                            <tbody>

                                                {Object.values(itemsList).map((item, index) => {
                                                    if (index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                        start_count++;

                                                        return <ListEachTaskForUser
                                                            key={item.id}
                                                            checkpointId={this.props.checkpointId}
                                                            task={item}
                                                            deleteTask={this.deleteTask}
                                                            translations={this.props.translations}
                                                            // onChangeCheckboxIsForReservation={this.onChangeCheckboxIsForReservation}
                                                        // activeDefaultLanguage={this.activeDefaultLanguage}
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
            </main >
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    let token = ownProps.match.params.token;

    return {
        token: token,
        // userTasks: 
        // checkpointId: checkpointId,
        // checkpoint: state.checkpoints.checkpoints[checkpointId] || null,
        tasksForCheckpoint: [],
        page: Number(state.router.location.query.page) || 1,
        translations: state.lang
    };
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        dispatch,
        ...bindActionCreators({ listCheckpoints, addEditCheckpoint, openConfirmModal, addErrorMessages, addSuccessMessage, listUserTasks }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListCheckpointTasksForUserPage);
