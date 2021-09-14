import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addEditCheckpoint, listCheckpoints} from '../../actions/checkpoints.actions';
import { addErrorMessages, addSuccessMessage } from './../../../messages/messages.actions';
import { addEditTask } from './../../../tasks/actions/tasks.actions';
import { listUsers } from './../../../../actions/usersActions';
import { ADMIN_URL, API_TOKEN } from '../../../../constants';
import AddEditCheckpointTaskForm from './AddEditCheckpointTaskForm';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import moment from 'moment';

// import Utils from '../../../utils/Utils';
// import Auth from './../../../utils/Auth';

// let md5 = require('md5');

class AddCheckpointTaskPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: '',
            description: "",
            rotation_start_date: moment().toDate(),
            rotation_days_count: 1,
            times_per_day_of_task_execution: 1,
            users: []
		}

	}

    componentWillMount() {
        this.props.listCheckpoints();
        this.props.listUsers();
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

        let users = this.state.users.map(u => u.value)

		const post = {
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
        console.log(this.state)
		return (
			<main className="main">

				{/* <!-- Breadcrumb--> */}
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "checkpoints"}>{this.props.translations.checkpoints.title}</NavLink></li>
                    <li className="breadcrumb-item active">{this.props.checkpoint && this.props.checkpoint.name || ""}</li>
                    <li className="breadcrumb-item"><NavLink to={ADMIN_URL + `checkpoints/${this.props.checkpointId}/tasks`}>{this.props.translations.checkpoints.tasks_for_checkpoint}</NavLink></li>

					<li className="breadcrumb-item active">{this.props.translations.checkpoints.add_task}</li>
				</ol>

				<div className="container-fluid">
					<div className="animated fadeIn">
						<div className="row">

							{/* <!-- /.col--> */}
							<div className="col-sm-12">
								<div className="card">

									<AddEditCheckpointTaskForm
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeCheckbox={this.onChangeCheckbox}
										onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
										onFieldChange={this.onFieldChange}
										task={this.state}
                                        users={this.props.users}
										currentDate={this.state.currentDate}
										actionText="Добави"
										isAdding={1}
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

	return {
        checkpointId: checkpointId,
        checkpoint: state.checkpoints.checkpoints[checkpointId] || null,
        users: state.users.users || [],
        translations: state.lang,
		clients: state.clients.clients,
		places: state.places.places,
	}
};

// const mapDispatchToProps = (dispatch, ownProps) => {
// 	return {
// 		addCheckpoint: (data, imageData) => dispatch(addCheckpoint(ownProps.history, data, imageData)),
// 		addErrorMessages: (msgs) => dispatch(addErrorMessages(msgs))
// 	}
// }

export default withRouter(connect(mapStateToProps, { addEditCheckpoint, listCheckpoints, addErrorMessages, addSuccessMessage, addEditTask, listUsers })(AddCheckpointTaskPage));