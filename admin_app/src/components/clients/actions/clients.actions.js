import axios from 'axios';
import { LIST_CLIENTS } from './types';
import { API_URL, ADMIN_URL } from './../../../constants';
import { addSuccessMessage, addErrorMessages } from './../../messages/messages.actions';
import { changeLanguage } from './../../../actions/languagesActions';
import Auth from './../../../utils/Auth';
import jwtDecode from 'jwt-decode';

export const listClients = () => dispatch => {
    let currUser = jwtDecode(Auth.getToken());

    // if(currUser.role !== "SUPER_ADMIN") {
    //     return;
    // }

    axios
        .get(API_URL + `clientsAdmin`)
        .then(res => {
            dispatch({
                type: LIST_CLIENTS,
                payload: res.data
            });
        })
        .catch(error => {
            throw (error);
        });
}

export const addEditClient = (postData, history, langId) => dispatch => {
    axios
        .post(API_URL + 'clients', postData)
        .then((post) => {
            post = post.data;
            // dispatch(addEditAllergenTranslation(post.id, langId, postData))
            // if (!postData.id && typeof postData.deleted === "undefined") { // edit
            // } else {
                dispatch(listClients());
                history.push(ADMIN_URL + 'clients');
                dispatch(addSuccessMessage("Changes saved"))
                
            // }
        })
        .catch(function (error) {
            // dispatch(addErrorMessages('Error occured'));
        })
}