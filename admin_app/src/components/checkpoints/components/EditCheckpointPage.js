import React, { Component } from 'react'
import AddEditCheckpointForm from './AddEditCheckpointForm';
import { addEditCheckpoint, removeCheckpoint, listCheckpoints } from '../actions/checkpoints.actions';
// import { listRestaurantHalls } from '../restaurantHalls/actions/restaurantHalls.actions';
import { addErrorMessages, addSuccessMessage } from './../../messages/messages.actions';

import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL, ADMIN_QR_CODE_DATA } from '../../../constants';
import Utils from './../../../utils/Utils';
import Auth from './../../../utils/Auth';
import QRCodeStyling from "qr-code-styling";

let md5 = require('md5');

const checkpointQRCode = new QRCodeStyling(ADMIN_QR_CODE_DATA);

class EditCheckpointPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			id: this.props.match.params.id,
			name: this.props.checkpoint.name ? this.props.checkpoint.name : "",
			token: this.props.checkpoint.token ? this.props.checkpoint.token : "",
			// checkpoint_num: this.props.checkpoint.checkpoint_num ? this.props.checkpoint.checkpoint_num : '',
			// checkpoint_token: this.props.checkpoint.checkpoint_token ? this.props.checkpoint.checkpoint_token : '',
			// qr_code_image: this.props.checkpoint.qr_code_image ? this.props.checkpoint.qr_code_image : '',
			// active: this.props.checkpoint.active ? this.props.checkpoint.active : 0,
			// place_in_url: this.props.checkpoint.place_in_url ? this.props.checkpoint.place_in_url : 0,
			// currentDate: + new Date(),
			// checkpointOrdertypes: [],
			// checkpointOrdertype: '',
			// checkpointOrdertypeValue: '',

			// reservation_min_people: '',
			// reservation_max_people: '',
			// restaurantHallId: ''
		}
	}

	componentWillReceiveProps(nextProps) {
	
		
		this.setState({
			id: nextProps.match.params.id,
			name: nextProps.checkpoint.name ? nextProps.checkpoint.name : '',
			token: nextProps.checkpoint.token ? nextProps.checkpoint.token : '',
			// checkpoint_num: nextProps.checkpoint.checkpoint_num ? nextProps.checkpoint.checkpoint_num : '',
			// checkpoint_token: nextProps.checkpoint.checkpoint_token ? nextProps.checkpoint.checkpoint_token : '',
			// qr_code_image: nextProps.checkpoint.qr_code_image ? nextProps.checkpoint.qr_code_image : '',
			// active: nextProps.checkpoint.active ? nextProps.checkpoint.active : 0,
			// place_in_url: nextProps.checkpoint.place_in_url ? nextProps.checkpoint.place_in_url : 0,
			// checkpointOrdertype: checkpointOrdertype,
			// checkpointOrdertypeValue: checkpointOrdertype && checkpointOrdertype[0] && checkpointOrdertype[0] || "",
			// reservation_min_people: nextProps.checkpoint.reservation_min_people ? nextProps.checkpoint.reservation_min_people : '',
			// reservation_max_people: nextProps.checkpoint.reservation_max_people ? nextProps.checkpoint.reservation_max_people : '',
			// restaurantHallId: nextProps.checkpoint.restaurantHallId ? nextProps.checkpoint.restaurantHallId : '',

		});
	}

	componentWillMount() {
		this.props.listCheckpoints();
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

		// const { places, clients } = this.props;

		// const errors = this.validate();
		// if (errors.length > 0) {
		// 	this.props.addErrorMessages(errors);
		// 	return;
		// }

		// let currClient = '';
		// let currPlace = '';

		// if (places) {
		// 	currPlace = places.find(p => p.id == Auth.getUserPlace());

		// 	if (currPlace && Object.values(currPlace).length > 0 && currPlace.clientId) {
		// 		currClient = clients.find(c => c.id == currPlace.clientId)
		// 	}
		// }

		// let currClientSlug = '';
		// if (currClient && Object.keys(currClient).length > 0 && currClient.slug) {
		// 	currClientSlug = currClient.slug;
		// }

		// const post = {
		// 	id: this.state.id,
		// 	checkpoint_num: this.state.checkpoint_num,

		// 	// checkpoint_token: this.state.checkpoint_token, //  md5(md5(this.state.checkpoint_num + (this.state.currentDate))),
		// 	qr_code_image: this.state.qr_code_image,
		// 	active: this.state.active,
		// 	place_in_url: this.state.place_in_url,
		// 	place_url: this.state.place_in_url ? '/' + currClientSlug : '',
		// 	checkpointOrdertypes: [this.state.checkpointOrdertypeValue.value],
		// 	reservation_min_people: this.state.reservation_min_people || 0,
		// 	reservation_max_people: this.state.reservation_max_people || 0,
		// 	restaurantHallId: this.state.restaurantHallId || null
		// }

		// var canvas = document.getElementById('checkpoint-qr-code');
		// let formData = new FormData()

		// if (canvas) {
		// 	var img = canvas.toDataURL("image/png");

		// 	if (img) {
		// 		// Image append
		// 		formData.append("file", img)
		// 	}
		// }

		const post = {
			id: this.state.id,
			name: this.state.name,
		}

		this.props.addEditCheckpoint(post)
		.then(resp => {
			this.props.history.push("/admin/checkpoints")
			this.props.addSuccessMessage("Успешно редактиране на локация")
		})
		.catch(error => {
			this.props.addErrorMessages(error.response.data.error.errors);
		})

	}

	deleteCheckpoint = (e, id) => {
		e.preventDefault();
		this.props.removeCheckpoint(id, this.props.history);
	}

	generateNewQrCode = (e) => {
		e.preventDefault();
		let formData = new FormData()

		this.props.addEditCheckpoint({ id: this.state.id, token: "token_to_be_changed" })
		.then(resp => {
			// this.props.history.push("/admin/checkpoints")
			this.props.addSuccessMessage("Успешно редактиране на локация")
			this.props.listCheckpoints();

		})
		.catch(error => {
			this.props.addErrorMessages(error.response.data.error.errors);
		})
		// this.props.editCheckpoint(this.state.id, { token: "token_to_be_changed" }, this.props.history, formData);

		// let newToken = Utils.generateCheckpointToken(this.state.checkpoint_num);

		// this.setState({
		// 	checkpoint_token: newToken
		// })
		// console.log("NEW", newToken)
	}

	downloadQR = () => {
		checkpointQRCode.download({
			extension: 'png',
			name: this.state.name
		});
		

		// const canvas = document.querySelector("#checkpoint-qr-code2 canvas");
		// const pngUrl = canvas
		// 	.toDataURL("image/png")
		// 	.replace("image/png", "image/octet-stream");
		// let downloadLink = document.createElement("a");
		// downloadLink.href = pngUrl;
		// downloadLink.download = "Checkpoint" + this.state.checkpoint_num + ".png";
		// document.body.appendChild(downloadLink);
		// downloadLink.click();
		// document.body.removeChild(downloadLink);
	};

	render() {

		// const findNextCheckpoint = () => {
		// 	if (this.props.checkpoint && this.props.checkpoints && this.props.checkpoint.checkpoints) {
		// 		let checkpoint = this.props.checkpoint;
		// 		let checkpoints = this.props.checkpoints.checkpoints;
		// 		console.log(`checkpoint`, checkpoint)
		// 		console.log(`checkpoints`, checkpoints)
		// 		console.log(`checkpoint.id`, checkpoint.id)
		// 		let index = Object.values(checkpoints.checkpoints).findIndex(t => t.id == checkpoint.id)
		// 		console.log(`index`, index)
		// 		let nextCheckpoint = Object.values(checkpoints.checkpoints)[index + 1].id
		// 		console.log(`nextCheckpoint`, nextCheckpoint)
		// 		// return nextCheckpoint;
		// 	}
		// }

		console.log("STATE ", this.state);
		return (
			<main className="main">

				{/* <!-- Breadcrumb--> */}
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "checkpoints"}>{this.props.translations.checkpoints.title}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.checkpoints.edit}</li>
					{/* <li className="breadcrumb-menu d-md-down-none">
						<div className="btn-group" role="group" aria-label="Button group">
						</div>
					</li> */}
					<li className="breadcrumb-menu d-md-down-none">
						<div className="btn-group" role="group" aria-label="Button group">
							{/* <button onClick={() => Utils.navigateTo(ADMIN_URL + `checkpoints/edit/` + findNextCheckpoint())}> */}
							{/* <button onClick={() => console.log(findNextCheckpoint())}>
								{this.props.translations.common.next}&nbsp;<i className="fas fa-arrow-right"></i>
							</button> */}
							{/* <NavLink to={ADMIN_URL + `checkpoints/edit/` + findNextCheckpoint()} className="btn" >
								{this.props.translations.common.next}&nbsp;<i className="fas fa-arrow-right"></i>
							</NavLink> */}
						</div>
					</li>

				</ol>

				<div className="container-fluid">
					<div className="animated fadeIn">
						<div className="row">

							{/* <!-- /.col--> */}
							<div className="col-sm-12">
								<div className="card">

									<AddEditCheckpointForm
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeCheckbox={this.onChangeCheckbox}
										// onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
										onFieldChange={this.onFieldChange}
										checkpoint={this.state}
										// restaurantHalls={this.props.restaurantHalls}

										// checkpointId={this.state.id}
										// checkpointNum={this.state.checkpoint_num}
										// checkpointToken={this.state.checkpoint_token}
										qrCodeImage={this.state.qr_code_image}
										// checkpointActive={this.state.active}
										placeInUrl={this.state.place_in_url}
										currentDate={this.state.currentDate}
										// checkpointOrdertypeValue={this.state.checkpointOrdertypeValue}

										deleteCheckpoint={this.deleteCheckpoint}
										actionText="Запази"
										isAdding={0}
										// nameError={this.props.errors.find(error => error.path === 'name') ? this.props.errors.find(error => error.path === 'name') : ""}
										translations={this.props.translations}
										generateNewQrCode={this.generateNewQrCode}
										downloadQr={this.downloadQR}
										currPlaceOrderTypes={this.props.currPlaceOrderTypes}

										checkpointQRCode={checkpointQRCode}
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
	let checkpointId = ownProps.match.params.id;

	let orderTypes = [];

	if (state.places.places) {
		let currPlace = state.places.places.find(p => p.id == Auth.getUserPlace());
		if (currPlace) {
			orderTypes = currPlace.ordertypes;
		}
	}

	let checkpoint = state.checkpoints.checkpoints[checkpointId];
	if (!checkpoint) checkpoint = {
		id: '',
		checkpoint_num: '',
		qr_code_image: '',
		active: '',
		place_in_url: '',
		checkpoint_token: '',
		ordertypes: [],
	};
	return {
		checkpoint: checkpoint,
		checkpoints: state.checkpoints,
		currPlaceOrderTypes: orderTypes,
		// restaurantHalls: state.restaurantHalls.restaurantHalls || [],
		errors: state.checkpoints.errors,
		translations: state.lang,

		clients: state.clients.clients,
		places: state.places.places,
	}


};

export default connect(mapStateToProps, { listCheckpoints, addEditCheckpoint, removeCheckpoint, addErrorMessages, addSuccessMessage })(EditCheckpointPage);