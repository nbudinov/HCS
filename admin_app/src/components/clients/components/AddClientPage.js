import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addEditClient, listClients } from '../actions/clients.actions';
import AddEditClientForm from './AddEditClientForm';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../../constants';
import { addErrorMessages } from '../../messages/messages.actions';

class AddClientPage extends Component {
	constructor(props) {
		super(props)

		this.state = { 
			currLang: this.props.currLang,
			name: '',
			slug: '',
			owner_name: '',
			address: '',
			contract_start_date: '',
			trial_start_date: '',
			trial_end_date: '',
			monthly_fee: '',
			additional_info: '',
			active: 1,
		}
	  
	}

    componentWillMount() {
        this.props.listClients();
    }

	onChange = (e) => {
		this.setState({ [e.target.name]: e.target.value });
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
        if(errors.length > 0) {
            this.props.addErrorMessages(errors);
            return;
		}
		
		const post = {
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
			verified: 1
		}

		this.props.addEditClient(post, this.props.history, this.props.languages[this.state.currLang].id);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			name: '',
		});
	}

    render() {
		
    	return (
			<main id="clients-page" className="main">

				{/* <!-- Breadcrumb--> */}
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.alergens}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "clients"}>{this.props.translations.clients.title}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.clients.add}</li>
					{/* <!-- Breadcrumb Menu--> */}
					<li className="breadcrumb-menu d-md-down-none">
                        <div className="btn-group" role="group" aria-label="Button group">
                        </div>
                    </li>
				</ol>

        		<div className="container-fluid">
           			<div className="animated fadeIn">
              			<div className="row">
                
							{/* <!-- /.col--> */}                
							<div className="col-sm-12">
								<div className="card">

									<AddEditClientForm
                                        clients={this.props.clients}
										onSubmit={this.onSubmit}
                                        onChange={this.onChange}
										onFieldChange={this.onFieldChange}
										onChangeCheckbox={this.onChangeCheckbox}
										client={this.state}
										isAdding="1"
										translations={this.props.translations}
										currLang={this.state.currLang}
										languages={this.props.languages}
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
	currLang: state.settings.settings['default_lang'] && state.settings.settings['default_lang'].value || "bg",
});

export default connect(mapStateToProps, { addEditClient, addErrorMessages, listClients })(AddClientPage);