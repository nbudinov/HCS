import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addEditCheckpoint } from '../actions/checkpoints.actions';
import AddEditCheckpointForm from './AddEditCheckpointForm';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, API_TOKEN } from '../../../constants';
import { addErrorMessages, addSuccessMessage } from './../../messages/messages.actions';
import { withRouter } from 'react-router-dom';
import Utils from '../../../utils/Utils';
import Auth from './../../../utils/Auth';

// let md5 = require('md5');

class AddCheckpointPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			name: '',
			currentDate: + new Date(),
		}

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

		this.props.addEditCheckpoint({
			name: this.state.name,
		})
		.then(resp => {
			this.props.history.push("/admin/checkpoints")
			this.props.addSuccessMessage("Успешно създаване на локация")
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
					<li className="breadcrumb-item active">{this.props.translations.checkpoints.add}</li>
					<li className="breadcrumb-menu d-md-down-none">
						<div className="btn-group" role="group" aria-label="Button group">
						</div>
					</li>
				</ol>

				<div className="container-fluid">
					<div className="animated fadeIn">
						<div className="row">
							<div className="col-sm-12">
								<div className="card">
									<AddEditCheckpointForm
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										checkpoint={this.state}
										currentDate={this.state.currentDate}
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

const mapStateToProps = state => {
	return {
		translations: state.lang,
		clients: state.clients.clients,
		places: state.places.places,
	}
};


export default withRouter(connect(mapStateToProps, { addEditCheckpoint, addErrorMessages, addSuccessMessage })(AddCheckpointPage));