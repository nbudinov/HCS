import React, { Component } from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { NavLink } from 'react-router-dom';
import { push } from 'react-router-redux';
import { addErrorMessages, addSuccessMessage } from './../../../messages/messages.actions';
import { listCheckpoints, addEditCheckpoint } from '../../../checkpoints/actions/checkpoints.actions';
import { listAllTasks, listUserTasks } from './../../../tasks/actions/tasks.actions';
import { createVisit } from './../../../visits/actions/visits.actions';
import { openConfirmModal } from './../../../../actions/adminActions';
import { ADMIN_URL, ITEMS_PER_PAGE, ITEMS_PAGE_RANGE_DISPLAYED, ADMIN_QR_CODE_DATA } from '../../../../constants.js'
import ListEachUserTask from './ListEachUserTask';
import Pagination from "react-js-pagination";
import MessageContainer from './../../../messages/MessagesContainer';
import ScanModal from './ScanModal';
import CommentModal from './CommentModal';
import Auth from '../../../../utils/Auth';
import ListEachUserTaskBox from './ListEachUserTaskBox';

class ListUserTasksPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            scanned: false,
            scanModalOpened: false,
            taskIdToComplete: null,
            commentModalOpened: false,
            visitComment: ""
        }
    }

    componentWillMount() {
        this.props.listUserTasks();
        this.props.listCheckpoints();
    }

    onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
    }

    handlePageChange = (page) => {
        this.props.dispatch(push('/admin/checkpoints/' + this.props.checkpointId + '/tasks?page=' + page))
    }

    onCompleteTask = (taskId) => {
        console.log(taskId)
        this.setState({
            commentModalOpened: true,
            taskIdToComplete: taskId
        });
    }

    onSubmitComment = () => {
        this.setState({
            scanModalOpened: true,
            commentModalOpened: false,
        });
    }

    handleScan = (scannedToken) => {
        if (scannedToken) {
            if (this.state.scanned == false) {
                this.setState({ scanned: true });

                let post = {
                    token: scannedToken,
                    taskId: this.state.taskIdToComplete,
                    comment: this.state.visitComment
                }

                this.props
                    .createVisit(post)
                    .then((data) => {
                        console.log(data);
                        this.setState({ scanModalOpened: false, commentModalOpened: false, scanned: false, visitComment: "" });
                        this.props.listUserTasks();
                        this.props.addSuccessMessage("Успешно изпълнихте задачата")
                    })
                    .catch(err => {
                        this.props.addErrorMessages(err)
                        this.setState({ scanModalOpened: false, commentModalOpened: false, scanned: false });
                    })
            }
        }
    }

    handleScanError = (err) => {
        console.error(err);
    }
    
    render() {
        let itemsList = this.props.tasks;

        const items_count = Object.keys(itemsList).length
        const current_page = this.props.page;
        const start_offset = (current_page - 1) * ITEMS_PER_PAGE;
        let start_count = 0;

        return (
            <main className="main">
                <ol className="breadcrumb"></ol>
                <div className="container-fluid">
                    <div className="animated fadeIn">
                        <div className="row">
                            <div className="col-lg-12">
                                <div className="card">
                                    <MessageContainer />
                                    <div className="card-body">
                                        <div className="row">
                                            {Object.values(itemsList).map((item, index) => {
                                                if (index >= start_offset && start_count < ITEMS_PER_PAGE) {
                                                    start_count++;
                                                    return <ListEachUserTaskBox
                                                        key={item.id}
                                                        onCompleteTask={this.onCompleteTask}
                                                        task={item}
                                                        deleteTask={this.deleteTask}
                                                        translations={this.props.translations}
                                                    />
                                                }
                                            })}
                                        </div>
                                        
                                        <ScanModal
                                            isOpened={this.state.scanModalOpened}
                                            onClose={() => this.setState({scanModalOpened: false})}
                                            onError={this.props.onError}
                                            handleScanError={this.handleScanError}
                                            handleScan={this.handleScan}
                                        />

                                        <CommentModal
                                            isOpened={this.state.commentModalOpened}
                                            onClose={() => this.setState({commentModalOpened: false})}
                                            onSubmitComment={this.onSubmitComment}
                                            onChange={this.onChange}
                                            visitComment={this.state.visitComment}
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
        tasks: state.tasks.tasks || [],
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
        ...bindActionCreators({ listCheckpoints, addEditCheckpoint, openConfirmModal, addErrorMessages, addSuccessMessage, listUserTasks, createVisit }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ListUserTasksPage);
