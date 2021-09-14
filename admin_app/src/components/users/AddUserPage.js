import React, { Component } from 'react'
import { connect } from 'react-redux';
import { addUser, listUserRoles } from '../../actions/usersActions';
import { listPlacesByUserRole } from './../places/actions/places.actions';
import AddEditUserForm from './AddEditUserForm';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../constants';
import { addErrorMessages } from './../messages/messages.actions';

class AddUserPage extends Component {
	constructor(props) {
		super(props)

		this.state = { 
			email: '',
			active: 1,
			role: 0,
			placeId: 0
		}
	  
		this.onChange = this.onChange.bind(this);
		this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}

	componentDidMount() {
		this.props.listUserRoles();
		this.props.listPlacesByUserRole()
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			email: '',
			active: 1
		});
	}

	onChange(e) {
		this.setState({ [e.target.name]: e.target.value });
	}
	
	onChangeCheckbox(e) {
		this.setState({ [e.target.name]: e.target.checked });
	}

	validate(post) {
		let errors = [];

		// if (post.email.length === 0) {
		// 	errors.push(this.props.translations.messages.errors.invalid_email);
		// }
		if (post.role == 0) {
			errors.push(this.props.translations.messages.errors.invalid_role);
		}
		if (post.placeId == 0) {
			errors.push(this.props.translations.messages.errors.invalid_place);
		}
		return errors;
	}

	onSubmit(e) {
		e.preventDefault();

		const post = {
			email: this.state.email,
			password: this.state.password,
			active: this.state.active,
			role: this.state.role,
			placeId: this.state.placeId
		}

		const errors = this.validate(post);
        if (errors.length > 0) {
            this.props.addErrorMessages(errors);
            return;
        }

		this.props.addUser(post, this.props.history);
	}
    render() {
    	return (
			<main className="main">
				<ol className="breadcrumb">
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "users"}>{this.props.translations.sidemenu.users}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.users.add}</li>
				</ol>
        		<div className="container-fluid">
           			<div className="animated fadeIn">
              			<div className="row">
							<div className="col-sm-12">
								<div className="card">
									<AddEditUserForm
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeCheckbox={this.onChangeCheckbox}
										userEmail={this.state.email}
										userActive={this.state.active}
										isAddingUser={1}
										translations={this.props.translations}
										roles={this.props.roles}
										places={this.props.places}
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
	errors: state.users.errors,
	translations: state.lang,
	roles: state.users.roles,
	places: state.places.places || []
});

export default connect(mapStateToProps, { addUser, listUserRoles, addErrorMessages, listPlacesByUserRole})(AddUserPage);