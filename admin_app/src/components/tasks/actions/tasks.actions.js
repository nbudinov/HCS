import axios from 'axios';
import { LIST_TASKS } from './types';
import { API_URL, ADMIN_URL } from './../../../constants';
import { addSuccessMessage, addErrorMessages } from './../../messages/messages.actions';
import { changeLanguage } from './../../../actions/languagesActions';
import Auth from './../../../utils/Auth';
import jwtDecode from 'jwt-decode';
import moment from 'moment';

export const listAllTasks = (date = null, userId = null) => dispatch => {
    let currUser = jwtDecode(Auth.getToken());

    let query = "?";

    if(date) {
        date = moment(date).format('YYYY-MM-DD')
        query += "date=" + date;
    }
   
    if(userId) {
        query += "&userId=" + userId;
    }

    axios
        .get(API_URL + `tasks${query}`)
        .then(res => {
            dispatch({
                type: LIST_TASKS,
                payload: res && res.data ? res.data : []
            });
        })
        .catch(error => {
            throw (error);
        });
}

export const listUserTasks = (checkpointToken = null) => dispatch => {
    let currUser = jwtDecode(Auth.getToken());

    let query = "?";
    
    if(checkpointToken) {
        query += "token=" + checkpointToken;
    }

    axios
        .get(API_URL + `userTasks${query}`)
        .then(res => {
            dispatch({
                type: LIST_TASKS,
                payload: res && res.data ? res.data : []
            });
        })
        .catch(error => {
            throw (error);
        });
}

export const addEditTask = (postData) => dispatch => {
    if (!postData.place_id) {
        postData.place_id = Auth.getUserPlace();
    }
    
    return axios
        .post(API_URL + `tasks`, postData)
}
