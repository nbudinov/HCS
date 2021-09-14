import React, { Component } from 'react';
import { NavLink } from "react-router-dom";
import { connect } from 'react-redux';
// import { history } from '../../utils/history';
import { history } from './../../store';

import { login, setCurrentUser } from '../../actions/authActions';
import jwt from 'jsonwebtoken';
import {ADMIN_URL, FILTER_PLACES_NAME} from './../../constants';
import Auth from './../../utils/Auth';
import MessagesContainer  from './../messages/MessagesContainer';
import { addErrorMessages }  from './../messages/messages.actions';

import jwtDecode from 'jwt-decode';
import setAuthorizationToken from '../../utils/setAuthorizationToken';
import LoginForm from './LoginForm';
// import '../../../css/login.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    isLoggedIn(){
        if (jwt.decode(Auth.getToken()) && jwt.decode(Auth.getToken()) != undefined){
            history.push('/my-tasks');
        }
    }

    componentWillMount() {
        this.isLoggedIn();
    }

    handleChange(e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    handleSubmit(e) {
        e.preventDefault();

        if (!!this.state.email && !!this.state.password) {
            this.props.login(this.state).then(res => {
                const token = res.data.token;
                if (token) {
                    Auth.setToken(token);
                    setAuthorizationToken(token);
    
                    let currUser = jwtDecode(token);
                    this.props.setCurrentUser(currUser);
                    Auth.setUserPlace(currUser.place_id)
                    window.localStorage.setItem(FILTER_PLACES_NAME, JSON.stringify([currUser.place_id]));
                    window.location.href = '/my-tasks';
                } else {
                    this.props.addErrorMessages([this.props.translations.messages.errors.invalid_credentials]);
                }
            })
            .catch(err => {
                this.props.addErrorMessages([this.props.translations.messages.errors.invalid_credentials]);
            });
        } else {
            this.props.addErrorMessages([this.props.translations.messages.errors.invalid_credentials]);
        }
    }

    render(){
        return (<>
            <MessagesContainer/>

            <LoginForm 
                onChange={this.handleChange}
                onSubmit={this.handleSubmit}
                email={this.state.email}
                password={this.state.password}
                translations={this.props.translations}
            />
        </>);
    }
}

const mapStateToProps = state => {
	return {
		translations: state.lang,
	}
};
export default connect(mapStateToProps, { login, setCurrentUser, addErrorMessages })(Login);