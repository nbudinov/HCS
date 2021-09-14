import axios from 'axios';
import { LIST_USERS, ADD_EDIT_CATEGORY_ERROR, LIST_USER_ROLES, LIST_REGISTERED_USERS } from './types';
import { API_URL, ADMIN_URL } from './../constants'
import { addErrorMessages, addSuccessMessage } from './../components/messages/messages.actions';
import Auth from './../utils/Auth';
import jwtDecode from 'jwt-decode';

export const listUsers = (place_id = null) => dispatch => {
    let currUser = jwtDecode(Auth.getToken());

    let query = "";
    // if(currUser.role == "CLIENT_ADMIN") {
    //     query = `?client_id=${currUser.client_id}`
    // } else if(currUser.role != "SUPER_ADMIN") {
    //     return;
    // }

    axios
        .get(API_URL + 'users' + query)
        .then(res =>
            dispatch({
                type: LIST_USERS,
                payload: res && res.data || []
            })
        ).catch(error => {
            console.log('erroring ', error)
            throw (error);
        });
}

export const getRegisteredUsers = (placeId = null) => dispatch => {
    let query = "";

    if (placeId != null) {
        query += "?place_id=" + placeId;
    }

    // let place_id = Auth.getUserPlace();
    // query += "?place_id=" + place_id;

    axios
        .get(API_URL + 'users/registered' + query)
        .then(res =>
            dispatch({
                type: LIST_REGISTERED_USERS,
                payload: res && res.data || []
            })
        ).catch(error => {
            console.log('erroring ', error)
            throw (error);
        });
}

export const listUserRoles = () => dispatch => {
    axios
        .get(API_URL + 'users/roles')
        .then(res =>
            dispatch({
                type: LIST_USER_ROLES,
                payload: res.data
            })
        ).catch(error => {
            if (error && error.response && error.response.data && error.response.data.error && error.response.data.error.errors) {
                dispatch(addErrorMessages(error.response.data.error.errors));
            } else {
                dispatch(addErrorMessages(["Unauthorized"]));
            }

            // console.log('erroring ', error)
            // throw(error);
        });
}

export const addUser = (postData, history) => dispatch => {
    axios
        .post(API_URL + 'users/register', postData)
        .then(res => {
            dispatch(listUsers());

            history.push(ADMIN_URL + 'users');
        })
        .catch(error => {
            if (error && error.response) {
                dispatch(addErrorMessages(error.response.data.error.errors));
            } else {
                console.log("ERROR ", error);
            }
            // throw(error);
        });


    // fetch(API_URL + 'users/register', {
    //     method: 'POST',
    //     headers: {
    //         'content-type': 'application/json'
    //     },
    //     body: JSON.stringify(postData)
    // })
    // .then(res => res.json())
    // .then(
    //     function(post) {
    //         if (post.error) {
    //             dispatch({
    //                 type: ADD_EDIT_CATEGORY_ERROR,
    //                 payload: post.error.errors
    //             })
    //         } else {
    //             history.push(ADMIN_URL + 'users');
    //         }
    //     }
    // )
    // .catch(function(e) {
    // });
}

export const editUser = (id, postData, history) => dispatch => {
    axios
        .post(API_URL + 'users/edit', postData)
        .then(res => {
            dispatch(listUsers());

            history.push(ADMIN_URL + 'users');
        })
        .catch(error => {
            dispatch(addErrorMessages(error.response.data.error.errors));
            // throw(error);
        });


    // fetch(API_URL + 'users/edit', {
    //     method: 'POST',
    //     headers: {
    //         'content-type': 'application/json'
    //     },
    //     body: JSON.stringify(postData)
    // })
    // .then(res => res.json())
    // .then(
    //     function(post) {
    //         if (post.error) {
    //             dispatch({
    //                 type: ADD_EDIT_CATEGORY_ERROR,
    //                 payload: post.error.errors
    //             })
    //         } else {
    //             dispatch(listUsers())

    //             // listUsers();
    //             history.push(ADMIN_URL + 'users');
    //         }
    //     }
    // )
    // .catch(function(e) {
    //     console.log("error", e);
    // });
}
