import React, { Component } from 'react';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';

import { addEditPlace, listPlacesByUserRole, listOrderTypes, getCities } from '../actions/places.actions';
// import {  getTags } from './../../tags/actions/tags.actions';
import { listClients } from './../../clients/actions/clients.actions';
import { addErrorMessages, addSuccessMessage } from '../../messages/messages.actions';

import { ADMIN_URL } from '../../../constants';
import AddEditPlaceForm from './AddEditPlaceForm';
import { Tabs, Tab } from 'react-bootstrap';
// import OrderTypesTab from './edit/OrderTypesTab';
// import FunctionalityModulesTab from './edit/FunctionalityModulesTab';

class EditPlacePage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			currLang: this.props.currLang,
			id: this.props.item.id,
			name: this.props.item.name,
			short_name: this.props.item.short_name,
			company_name: this.props.item.company_name,
			company_eik: this.props.item.company_eik,
			company_vat_registered: this.props.item.company_vat_registered,
			company_city: this.props.item.company_city,
			company_address: this.props.item.company_address,
			company_person: this.props.item.company_person,
			company_email: this.props.item.company_email,
			monthly_fee: this.props.item.monthly_fee,
			additional_info: this.props.item.additional_info,
			image: this.props.item.image,
			lat: this.props.item.lat,
			lng: this.props.item.lng,
			visible_on_map: this.props.item.visible_on_map,
			is_paying: this.props.item.is_paying,
			cityId: this.props.item.cityId,
			tags: [],

			clientId: this.props.item.clientId ? this.props.item.clientId : '',
		}
	}

	componentWillMount() {
		this.props.listClients();
		this.props.listOrderTypes();
		this.props.getCities();
		this.props.getTags();
		// this.props.listPlacesByUserRole();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.item.id) {

			this.setState({
				id: nextProps.match.params.id,
				name: nextProps.item.name,
				short_name: nextProps.item.short_name,
				company_name: nextProps.item.company_name,
				company_eik: nextProps.item.company_eik,
				company_vat_registered: nextProps.item.company_vat_registered,
				company_city: nextProps.item.company_city,
				company_address: nextProps.item.company_address,
				company_person: nextProps.item.company_person,
				company_email: nextProps.item.company_email,
				monthly_fee: nextProps.item.monthly_fee,
				additional_info: nextProps.item.additional_info,
				image: nextProps.item.image,
				lat: nextProps.item.lat,
				lng: nextProps.item.lng,
				visible_on_map: nextProps.item.visible_on_map,
				is_paying: nextProps.item.is_paying,
				cityId: nextProps.item.cityId,

				clientId: nextProps.item.clientId ? nextProps.item.clientId : '',
			});
		}

		let currTags = [];

		if (Object.keys(nextProps.tags).length !== 0 && nextProps.item.tags) {
			nextProps.item.tags.map(t => {

				currTags.push({
					value: t.id, 'label': t.name
				})
			})

			this.setState({ tags: currTags });
		}

	}

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
	}

	onChangeCheckbox = (e) => {
		this.setState({ [e.target.name]: e.target.checked });
	}

	onChangeSelectAutocompleteItems = (valueLabel) => {
		this.setState({ 'clientId': valueLabel.value });
	}

	onChangeSelectAutocomplete = (field, valueLabel) => {
		this.setState({ [field]: valueLabel.value });
	}

	onChangeSelectAutocompleteMulti = (field, values) => {
		this.setState({ [field]: values });
	}

	validate() {
		let errors = [];

		if (this.state.name.length === 0) {
			errors.push(this.props.translations.messages.errors.invalid_name);
		}

		if (!this.state.cityId) {
			errors.push(this.props.translations.messages.errors.invalid_city);
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

		let tagsIds = this.state.tags && this.state.tags.map(t => t.value) || [];

		const post = {
			id: this.state.id,
			name: this.state.name,
			short_name: this.state.short_name,
			company_name: this.state.company_name,
			company_eik: this.state.company_eik,
			company_vat_registered: this.state.company_vat_registered,
			company_city: this.state.company_city,
			company_address: this.state.company_address,
			company_person: this.state.company_person,
			company_email: this.state.company_email,
			monthly_fee: this.state.monthly_fee,
			additional_info: this.state.additional_info,
			lat: this.state.lat,
			lng: this.state.lng,
			visible_on_map: this.state.visible_on_map,
			is_paying: this.state.is_paying,
			cityId: this.state.cityId,
			tagsIds: JSON.stringify(tagsIds),

			clientId: this.state.clientId,
		}

		const files = Array.from(document.querySelector('#placeImg').files)
        let formData = new FormData()
        files.forEach((file, i) => {
            formData.append("file", file)
        })

		Object.keys(post).map(k => {
            formData.append(k, post[k] || "")
		})

		this.props.addEditPlace(formData)
		.then((post) => {
            // post = post.data;
			this.props.listPlacesByUserRole();
            this.props.addSuccessMessage("Changes saved");
        })
        .catch( (error) => {
			console.log(" ERRRORRING " , error)
            this.props.addErrorMessages(error);
        })

	}

	// deleteAlergen = (e, id) => {
	// 	e.preventDefault();
	// 	this.props.addEditAlergen({ id: id, deleted: true }, this.props.history);
	// }

	currLangOnChange = (e) => {
		let newLang = e.target.value;
		let newNameValue = this.props.item.translations[newLang] && this.props.item.translations[newLang].name
			? this.props.item.translations[newLang].name : "";

		this.setState({
			name: newNameValue,
			currLang: newLang
		})
	}

	render() {
		// let catItem = this.props.cat;

		console.log("STATE ", this.state);
		return (
			<main className="main">

				{/* <!-- Breadcrumb--> */}
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "places"}>{this.props.translations.places.title}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.places.edit}</li>
					{/* <!-- Breadcrumb Menu--> */}
				</ol>

				<div className="container-fluid">
					<div className="animated fadeIn">
						<div className="row">

							<Tabs
								style={{ width: '100%' }}
								id="controlled-tab-example"
								activeKey={this.state.currentTab}
								onSelect={(k) => this.setState({ currentTab: k })}
							>

								<Tab style={{ width: '1000px' }} eventKey="edit" title={this.props.translations.places.edit} >
									<div className="col-sm-12">
										<div className="card">

											<AddEditPlaceForm
												clients={this.props.clients}
												onSubmit={this.onSubmit}
												onChange={this.onChange}
												onChangeSelectAutocompleteItems={this.onChangeSelectAutocompleteItems}
												onChangeCheckbox={this.onChangeCheckbox}
												onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
												onChangeSelectAutocompleteMulti={this.onChangeSelectAutocompleteMulti}
												place={this.state}
												isAdding="0"
												// deleteAlergen={this.deleteAlergen}
												translations={this.props.translations}
												currLang={this.state.currLang}
												currLangOnChange={this.currLangOnChange}
												languages={this.props.languages}
												cities={this.props.cities}
												tags={this.props.tags}
											/>

										</div>
									</div>
								</Tab>

								{/* <Tab eventKey="ordertypes" title={this.props.translations.places.ordertypes} >
									<OrderTypesTab
										place={this.props.item}
										translations={this.props.translations}
									/>
								</Tab> */}

								{/* <Tab eventKey="functionality_modules" title={this.props.translations.places.functionality_modules} >
									<FunctionalityModulesTab
										place={this.props.item}
										translations={this.props.translations}
									/>
								</Tab> */}
							</Tabs>



						</div>
					</div>
				</div>

			</main>
		)
	}
}

const mapStateToProps = (state, ownProps) => {
	let id = ownProps.match.params.id;

	let item = (state.places.places).find(i => i.id == id);
	if (!item) item = {
		id: '',
		name: '',
		clientId: '',
		translations: {},
		tags: [],
	};
	return {
		clients: state.clients.clients || [],
		item: item,
		errors: state.alergens.errors,
		translations: state.lang,
		languages: state.languages.languages || {},
		cities: state.places.cities || [],
		tags: [], //state.tags.tags || [],

		currLang: "bg",
	}
};

export default connect(mapStateToProps, { addEditPlace, listPlacesByUserRole, listClients, addErrorMessages, addSuccessMessage, listOrderTypes, getCities})(EditPlacePage);