import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addEditPlace, listPlacesByUserRole, getCities } from '../actions/places.actions';
// import { getTags } from './../../tags/actions/tags.actions';
import { listClients } from './../../clients/actions/clients.actions';
import AddEditPlaceForm from './AddEditPlaceForm';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../../constants';
import { addErrorMessages, addSuccessMessage } from '../../messages/messages.actions';

class AddPlacePage extends Component {
	constructor(props) {
		super(props)

		this.state = { 
			currLang: this.props.currLang,
			name: '',
			short_name: '',
			company_name: '',
			company_eik: '',
			company_vat_registered: '',
			company_city: '',
			company_address: '',
			company_person:'',
			company_email: '',
			monthly_fee: '',
			additional_info: '',
			lat: '',
			lng: '',
			visible_on_map: 0,
			is_paying: 0,
			cityId: 0,
			tags: [],

			clientId: '',
		}
	  
	}

    componentWillMount() {
        this.props.listClients();
		this.props.getCities();
		// this.props.getTags();

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
        if(errors.length > 0) {
            this.props.addErrorMessages(errors);
            return;
		}
		
		let tagsIds = this.state.tags.map(t => t.value)

		const post = {
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
			tagsIds: tagsIds,

			clientId: this.state.clientId,
		}

		const files = Array.from(document.querySelector('#placeImg').files)
		console.log("FILES ", files); 
        let formData = new FormData()
        files.forEach((file, i) => {
			console.log("each ", files); 

            formData.append("file", file)
        })

		Object.keys(post).map(k => {
            formData.append(k, post[k] || "")
		})

		this.props.addEditPlace(formData, this.props.history, this.props.languages[this.state.currLang].id)
		.then((post) => {
            post = post.data;
			this.props.listPlacesByUserRole();
			this.props.history.push("/admin/places/edit/"+post.id)
            this.props.addSuccessMessage("Successfully created place");
        })
        .catch( (error) => {
            this.props.addErrorMessages(error);
        })
	}

	

    render() {
		
    	return (
			<main className="main">

				{/* <!-- Breadcrumb--> */}
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.alergens}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "places"}>{this.props.translations.places.title}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.places.add}</li>
					{/* <!-- Breadcrumb Menu--> */}
					<li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                            {/* 
                            <!--<a className="btn" href="./">
                                <i className="icon-graph"></i>  Dashboard</a>
                            <a className="btn" href="#">
                                <i className="icon-settings"></i>  Settings</a>
                            --> 
                            */}
                        </div>
                    </li>
				</ol>

        		<div className="container-fluid">
           			<div className="animated fadeIn">
              			<div className="row">
                
							{/* <!-- /.col--> */}                
							<div className="col-sm-12">
								<div className="card">

									<AddEditPlaceForm
                                        clients={this.props.clients}
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeCheckbox={this.onChangeCheckbox}
                                        onChangeSelectAutocompleteItems={this.onChangeSelectAutocompleteItems}
										onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
										onChangeSelectAutocompleteMulti={this.onChangeSelectAutocompleteMulti}
										place={this.state}
										isAdding="1"
										translations={this.props.translations}
										currLang={this.state.currLang}
										languages={this.props.languages}
										cities={this.props.cities}
										tags={this.props.tags}

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

const mapStateToProps = state => ({
    // errors: state.categories.errors,
    clients: state.clients.clients || [],
	translations: state.lang,
	languages: state.languages.languages || {},
	cities: state.places.cities || [],
	tags: [],// state.tags.tags || [],

	currLang: state.settings.settings['default_lang'] && state.settings.settings['default_lang'].value || "bg",
});

export default connect(mapStateToProps, { addEditPlace, addErrorMessages, addSuccessMessage, listClients, listPlacesByUserRole, getCities })(AddPlacePage);