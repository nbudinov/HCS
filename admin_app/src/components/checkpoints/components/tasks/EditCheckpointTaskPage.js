import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addEditCheckpoint, listCheckpoints} from '../../actions/checkpoints.actions';
import { addErrorMessages, addSuccessMessage } from '../../../messages/messages.actions';
import { addEditTask, listAllTasks } from '../../../tasks/actions/tasks.actions';
import { listUsers } from '../../../../actions/usersActions';
import { ADMIN_URL, API_TOKEN } from '../../../../constants';
import AddEditCheckpointTaskForm from './AddEditCheckpointTaskForm';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
// import Utils from '../../../utils/Utils';
// import Auth from './../../../utils/Auth';

// let md5 = require('md5');

class EditCheckpointTaskPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: '',
            description: "",
            rotation_start_date: "",
            rotation_days_count: "",
            times_per_day_of_task_execution: "",
            users: []
		}

	}

    componentWillMount() {
        this.props.listCheckpoints();
        this.props.listUsers();
        this.props.listAllTasks();
    }

	componentWillReceiveProps(nextProps) {
		let taskUsers = [];
		if (nextProps.task.users.length > 0) {
			nextProps.task.users.map(u => {
				taskUsers.push({ value: parseInt(u.id), label: u.email })
			})
		}

		this.setState({
			id: nextProps.match.params.taskId,
			name: nextProps.task.name ? nextProps.task.name : '',
            description: nextProps.task.ndescriptioname ? nextProps.task.description : '',
			rotation_start_date: nextProps.task.rotation_start_date && moment(nextProps.task.rotation_start_date).toDate() || "",
			rotation_days_count: nextProps.task.rotation_days_count ? nextProps.task.rotation_days_count : '',
            times_per_day_of_task_execution: nextProps.task.times_per_day_of_task_execution ? nextProps.task.times_per_day_of_task_execution : '',
            users: taskUsers
		});

		console.log("NEXT ", nextProps)
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value })
	}

	onChangeCheckbox = (e) => {
		this.setState({ [e.target.name]: e.target.checked });
	}

	onChangeSelectAutocomplete = (fieldName, valueLabel) => {
		this.setState({ [fieldName]: valueLabel });
	}

	onFieldChange = (fieldName, value) => {
		this.setState({ [fieldName]: value });
	}

	validate() {
		let errors = [];

		if (this.state.name.length == 0) {
			errors.push(this.props.translations.messages.errors.invalid_name);
		}

		return errors;
	}

	onSubmit = (e) => {
		e.preventDefault();

		var errors = this.validate()
		if(errors.length > 0)  {
			this.props.addErrorMessages(errors); return
		}

        let users = this.state.users.map(u => u.value)

		const post = {
			id: this.state.id,
			name: this.state.name,
			description: this.state.description,
            rotation_start_date: this.state.rotation_start_date,
            rotation_days_count: this.state.rotation_days_count,
            times_per_day_of_task_execution: this.state.times_per_day_of_task_execution,
            checkpointId: this.props.checkpointId,
            usersIds: users
		}

		this.props.addEditTask(post)
		.then(resp => {
			this.props.history.push(`/admin/checkpoints/${this.props.checkpointId}/tasks`)
			this.props.addSuccessMessage("Успешно създаване на задача за локация")
		})
		.catch(error => {
			this.props.addErrorMessages(error.response.data.error.errors);
		})
	}

	render() {
		return (
			<main className="main">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "checkpoints"}>{this.props.translations.checkpoints.title}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.checkpoint && this.props.checkpoint.name || ""}</li>
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL + `checkpoints/${this.props.checkpointId}/tasks`}>{this.props.translations.checkpoints.tasks_for_checkpoint}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.checkpoints.add_task}</li>
				</ol>
				<div className="container-fluid">
					<div className="animated fadeIn">
						<div className="row">
							<div className="col-sm-12">
								<div className="card">
									<AddEditCheckpointTaskForm
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
										onFieldChange={this.onFieldChange}
										task={this.state}
                                        users={this.props.users}
										currentDate={this.state.currentDate}
										isAdding={0}
										translations={this.props.translations}
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</main>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
    let checkpointId = ownProps.match.params.id
    let taskId = ownProps.match.params.taskId

    let task = state.tasks.tasks[taskId];

	if (!task) task = {
		id: taskId,
		name: '',
        description: "",
        rotation_start_date: "",
        rotation_days_count: "",
        times_per_day_of_task_execution: "",
        users: []
	};

	return {
		task: task,
        checkpointId: checkpointId,
        checkpoint: state.checkpoints.checkpoints[checkpointId] || null,
        users: state.users.users || [],
        translations: state.lang,
		places: state.places.places,
	}
};

export default withRouter(connect(mapStateToProps, { listCheckpoints, addErrorMessages, addSuccessMessage, addEditTask, listUsers, listAllTasks })(EditCheckpointTaskPage));