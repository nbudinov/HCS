import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { addEditClient, listClients } from '../actions/clients.actions';
import { addErrorMessages } from '../../messages/messages.actions';

import { ADMIN_URL } from '../../../constants';
import AddEditClientForm from './AddEditClientForm';
import { Tabs, Tab } from 'react-bootstrap';
import moment from 'moment';

class EditClientPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currLang: this.props.currLang,
			id: this.props.item.id,
			name: this.props.item.name,
			owner_name: this.props.item.owner_name,
			address: this.props.item.address,
			contract_start_date: this.props.item.contract_start_date && moment(this.props.item.contract_start_date).toDate() || '',
			trial_start_date: this.props.item.trial_start_date && moment(this.props.item.trial_start_date).toDate() || '',
			trial_end_date: this.props.item.trial_end_date && moment(this.props.item.trial_end_date).toDate() || '',
			monthly_fee: this.props.item.monthly_fee,
			additional_info: this.props.item.additional_info,
			active: this.props.item.active			
		}
	}

	componentWillMount() {
        this.props.listClients();
		// this.props.listClientsByUserRole();
	}
	
	componentWillReceiveProps(nextProps) {
		if (nextProps.item.id) {

			this.setState({
				id: nextProps.match.params.id,
				name: nextProps.item.name,
				slug: nextProps.item.slug,
				owner_name: nextProps.item.owner_name,
				address: nextProps.item.address,
				contract_start_date: nextProps.item.contract_start_date && moment(nextProps.item.contract_start_date).toDate() || '',
				trial_start_date: nextProps.item.trial_start_date && moment(nextProps.item.trial_start_date).toDate() || '',
				trial_end_date: nextProps.item.trial_end_date && moment(nextProps.item.trial_end_date).toDate() || '',
				monthly_fee: nextProps.item.monthly_fee,
				additional_info: nextProps.item.additional_info,
				active: nextProps.item.active
			});
		}
	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onChangeCheckbox = (e) => {
		this.setState({ [e.target.name]: e.target.checked });
    }

	onFieldChange = (fieldName, value) => {
        this.setState({ [fieldName]: value });
	}

	validate() {
		let errors = [];

		if (this.state.name.length === 0) {
			errors.push(this.props.translations.messages.errors.invalid_name);
		}
		if (this.state.slug.length === 0) {
			errors.push(this.props.translations.messages.errors.invalid_slug);
		}
		return errors;
	}

	onSubmit = (e) => {
		e.preventDefault();

		const errors = this.validate();
		if (errors.length > 0) {
			this.props.addErrorMessages(errors);
			return;
		}

		const post = {
			id: this.state.id,
			name: this.state.name,
			slug: this.state.slug,
			address: this.state.address,
			owner_name: this.state.owner_name,
			monthly_fee: this.state.monthly_fee,
			additional_info: this.state.additional_info,
			contract_start_date: this.state.contract_start_date,
			trial_start_date: this.state.trial_start_date,
			trial_end_date: this.state.trial_end_date,
			active: this.state.active,
		}

		this.props.addEditClient(post, this.props.history, this.props.languages[this.state.currLang].id);

	}


	render() {
		// let catItem = this.props.cat;

		return (
			<main id="clients-page" className="main">

				{/* <!-- Breadcrumb--> */}
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "clients"}>{this.props.translations.clients.title}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.clients.edit}</li>
					{/* <!-- Breadcrumb Menu--> */}
				</ol>

				<div className="container-fluid">
					<div className="animated fadeIn">
						<div className="row">
							<div className="col-sm-12">
								<div className="card">

									<Tabs
										style={{ width: '100%'}}
										id="controlled-tab-example"
										activeKey={this.state.currentTab}
										onSelect={(k) => this.setState({ currentTab: k })}
									>

										<Tab eventKey="edit" title={this.props.translations.clients.edit} >
											<div className="col-sm-12">
												<div className="card">

													<AddEditClientForm
														clients={this.props.clients}
														onSubmit={this.onSubmit}
														onChange={this.onChange}
														onFieldChange={this.onFieldChange}
														onChangeCheckbox={this.onChangeCheckbox}
														// onChangeCheckbox={this.onChangeCheckbox}
														client={this.state}
														isAdding="0"
														// deleteAlergen={this.deleteAlergen}
														translations={this.props.translations}
														currLang={this.state.currLang}
														currLangOnChange={this.currLangOnChange}
														languages={this.props.languages}
													/>

												</div>
											</div>
										</Tab>

										

									</Tabs>								

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
	let id = ownProps.match.params.id;

	let item = (state.clients.clients).find(i => i.id == id);
	if (!item) item = {
		id: '',
		name: '',
		slug: '',
		address: '',
		owner_name: '',
		monthly_fee: '',
		additional_info: '',
		contract_start_date: '',
		trial_start_date: '',
		trial_end_date: '',
		active: 1
	};
	return {
        clients: state.clients.clients || [], 
		item: item,
		errors: state.alergens.errors,
		translations: state.lang,
		languages: state.languages.languages || {},
		currLang: "bg",
	}
};

export default connect(mapStateToProps, { addEditClient, listClients, addErrorMessages })(EditClientPage);