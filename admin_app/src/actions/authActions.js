// import jwt from 'jsonwebtoken';
import jwtDecode from 'jwt-decode';
import { SET_CURRENT_USER, LOGOUT } from './types';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import axios from 'axios';
import Auth from './../utils/Auth';
// import {history} from './../utils/history';
import { history } from './../store';
import { API_URL } from './../constants'
import { addErrorMessages } from './../components/messages/messages.actions';
export function logout() {
    // localStorage.removeItem('jwtToken');
    Auth.removeToken();
    setAuthorizationToken(false);
    history.push("/admin/login")
    // window.location.href='/admin/login';
    // return dispatch => {
    //     dispatch(setCurrentUser({}));
    // }
    return {
        type: LOGOUT
    }
}

export function login(data) {
    return dispatch => {
        return axios.post(API_URL + 'users/login', data)
    }
}

export function setCurrentUser(user) {
    return {
        type: SET_CURRENT_USER,
        user
    }
}