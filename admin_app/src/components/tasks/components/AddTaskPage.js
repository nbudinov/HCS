import React, { Component } from 'react'
import { connect } from 'react-redux';
import { listAllTasks, addEditTask } from '../actions/tasks.actions';
// import { getTags } from './../../tags/actions/tags.actions';
import { listClients } from './../../clients/actions/clients.actions';
import AddEditTaskForm from './AddEditTaskForm';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../../constants';
import { addErrorMessages, addSuccessMessage } from '../../messages/messages.actions';

class AddTaskPage extends Component {
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
        this.props.listAllTasks();
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

		const files = Array.from(document.querySelector('#taskImg').files)
		console.log("FILES ", files); 
        let formData = new FormData()
        files.forEach((file, i) => {
			console.log("each ", files); 

            formData.append("file", file)
        })

		Object.keys(post).map(k => {
            formData.append(k, post[k] || "")
		})

		this.props.addEditTask(formData, this.props.history, this.props.languages[this.state.currLang].id)
		.then((post) => {
            post = post.data;
			this.props.listTasksByUserRole();
			this.props.history.push("/admin/tasks/edit/"+post.id)
            this.props.addSuccessMessage("Successfully created task");
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
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "tasks"}>{this.props.translations.tasks.title}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.tasks.add}</li>
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

									<AddEditTaskForm
                                        clients={this.props.clients}
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeCheckbox={this.onChangeCheckbox}
                                        onChangeSelectAutocompleteItems={this.onChangeSelectAutocompleteItems}
										onChangeSelectAutocomplete={this.onChangeSelectAutocomplete}
										onChangeSelectAutocompleteMulti={this.onChangeSelectAutocompleteMulti}
										task={this.state}
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
    tasks: state.tasks.tasks || [],
	translations: state.lang,
	languages: state.languages.languages || {},

	currLang: state.settings.settings['default_lang'] && state.settings.settings['default_lang'].value || "bg",
});

export default connect(mapStateToProps, { listAllTasks, addEditTask, addErrorMessages, addSuccessMessage })(AddTaskPage);