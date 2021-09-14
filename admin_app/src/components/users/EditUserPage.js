import React, { Component } from 'react';
import AddEditUserForm from './AddEditUserForm';
import { listUsers, editUser, listUserRoles } from '../../actions/usersActions';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { ADMIN_URL } from '../../constants';
import { addErrorMessages } from './../messages/messages.actions';

class EditUserPage extends Component {
	constructor(props) {
		super(props)

		this.state = {
			id: this.props.match.params.id,
			email: this.props.user.email,
			active: this.props.user.active? this.props.user.active : 0,
			role: this.props.user.roleId ? this.props.user.roleId: 0,
			placeId: this.props.user.placeId ? this.props.user.placeId : 0
		}

		this.onChange = this.onChange.bind(this);
		this.onChangeCheckbox = this.onChangeCheckbox.bind(this);
		this.onSubmit = this.onSubmit.bind(this);
	}


	componentDidMount() {
		this.props.listUsers();
		this.props.listUserRoles();
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.user.id) {
			this.setState({
				id: nextProps.match.params.id,
				email: nextProps.user.email,
				active: nextProps.user.active? nextProps.user.active : 0,
				role: nextProps.user.roleId ? nextProps.user.roleId: 0,
				placeId: nextProps.user.placeId ? nextProps.user.placeId: 0,				
			});
		}
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
		return errors;
	}

	onSubmit(e) {
		e.preventDefault();

		const post = {
			id: this.state.id,
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
		
		this.props.editUser(this.state.id, post, this.props.history);
	}
	
 	 deleteUser = (e, id, email) => {
        // console.log('del', id)
		e.preventDefault();
		let post = {id: id, email: email, deleted:true};
		// this.props.removeUser(data, this.props.history);
		this.props.editUser(id, post, this.props.history);

		
	}
	

    render() {  
		return (
			<main className="main">
        
				{/* <!-- Breadcrumb--> */}
				<ol className="breadcrumb">
				<li className="breadcrumb-item"><NavLink to={ADMIN_URL}>{this.props.translations.common.dashboard}</NavLink></li>
					{/* <li className="breadcrumb-item">Меню</li> */}
					<li className="breadcrumb-item"><NavLink to={ADMIN_URL + "users"}>{this.props.translations.sidemenu.users}</NavLink></li>
					<li className="breadcrumb-item active">{this.props.translations.users.edit}</li>
					{/* <!-- Breadcrumb Menu--> */}
				</ol>

        		<div className="container-fluid">
           			<div className="animated fadeIn">
              			<div className="row">
                
							{/* <!-- /.col--> */}                
							<div className="col-sm-12">
								<div className="card">

									<AddEditUserForm
										onSubmit={this.onSubmit}
										onChange={this.onChange}
										onChangeCheckbox={this.onChangeCheckbox}
										userId={this.state.id}
										userEmail={this.state.email}
										userActive={this.state.active}
										deleteUser={this.deleteUser}
										actionText="Запази"
										isAddingUser="0"
										nameError={this.props.errors.find(error => error.path == 'name') ? this.props.errors.find(error => error.path == 'name') : "" }
										translations={this.props.translations}
										roles={this.props.roles}
										roleId={this.state.role}
										places={this.props.places}
										userPlaceId={this.state.placeId}										
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
  	let userId = ownProps.match.params.id;

		let user = state.users.users[userId];
		if (!user) user = { 
			id: '',
			email: '',
			active: '',
			role: 0,
			placeId: 0
	};

	return {
		user: user,
		errors: state.users.errors,
		translations: state.lang,
		roles: state.users.roles || [],
		places: state.places.places || []

	}
};

export default connect(mapStateToProps, {listUsers, editUser, listUserRoles, addErrorMessages })(EditUserPage);