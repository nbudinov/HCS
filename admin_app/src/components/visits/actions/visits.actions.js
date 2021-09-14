import axios from 'axios';
import { LIST_TASKS } from './types';
import { API_URL, ADMIN_URL } from './../../../constants';
import { addSuccessMessage, addErrorMessages } from './../../messages/messages.actions';
import { changeLanguage } from './../../../actions/languagesActions';
import Auth from './../../../utils/Auth';
import jwtDecode from 'jwt-decode';

export const createVisit = (post) => dispatch => {
    let currUser = jwtDecode(Auth.getToken());

    let query = "?";
    
    return axios.post(API_URL + `visits${query}`, post)
}
