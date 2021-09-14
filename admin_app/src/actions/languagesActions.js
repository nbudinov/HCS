import axios from 'axios';
import { LIST_LANGUAGES, ADD_EDIT_LANGUAGE_ERROR } from './types';
import { API_URL, ADMIN_URL } from './../constants'

export const changeLanguage = (language) => {
    localStorage.setItem('default_lang', language);
    return {
      type: 'SWITCH_LANGUAGE',
      language
    }
  }
  

export const listLanguages = () => dispatch => {
    axios
        .get(API_URL + 'languages')
        .then(res =>
            dispatch({
                type: LIST_LANGUAGES,
                payload: res.data
            })
        ).catch(error => {
            console.log('erroring ', error)
            throw(error);
        });
}

export const addLanguage = (postData, history) => dispatch => {
    fetch(API_URL + 'languages', {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(
        function(post) {
            if (post.error) {
                dispatch({
                    type: ADD_EDIT_LANGUAGE_ERROR,
                    payload: post.error.errors
                })
            } else {
                history.push(ADMIN_URL + 'settings/languages');
            }
        }
    )
    .catch(function(e) {
        console.log("error", e);
    });
}

export const editLanguage = (id, postData, history) => dispatch => {
    fetch(API_URL + 'languages/'+id, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(postData)
    })
    .then(res => res.json())
    .then(
        function(post) {
            if (post.error) {
                dispatch({
                    type: ADD_EDIT_LANGUAGE_ERROR,
                    payload: post.error.errors
                })
            } else {
                history.push(ADMIN_URL + 'settings/languages');
            }
        }
    )
    .catch(function(e) {
        console.log("error", e);
    });
}

export const removeLanguage = (id, history) => dispatch => {
    fetch(API_URL + 'languages/'+id, {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({deleted:true})
    })
    .then(res => res.json())
    .then(
        function(res) {
            if (history) {
                // Deleting from /edit
                history.push(ADMIN_URL + "settings/languages")
            } else { 
                // Deleting from /list
                dispatch(listLanguages())
            }
        }
    )
    .catch(function(e) {
        console.log("error", e);
    });
}
