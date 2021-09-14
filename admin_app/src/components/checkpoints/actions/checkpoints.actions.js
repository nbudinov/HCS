import axios from 'axios';
import { LIST_CHECKPOINTS } from './types';
import { API_URL, ADMIN_URL } from './../../../constants'
import { addErrorMessages, addSuccessMessage } from './../../messages/messages.actions';
import { history } from './../../../store';
import Auth from './../../../utils/Auth';
import { showLoading, hideLoading } from './../../common/loading/loading.actions';

export const listCheckpoints = (place_id = 0) => dispatch => {
    let getParam = '';
    if (place_id == 0) {
        place_id = Auth.getUserPlace();
        getParam += "?place_id=" + place_id;
    }

    axios
        .get(API_URL + 'checkpoints' + getParam)
        .then(res =>
            dispatch({
                type: LIST_CHECKPOINTS,
                payload: res && res.data || []
            })
        ).catch(error => {
            console.log('erroring ', error)
            // throw(error);
        });
}


export const addEditCheckpoint = (postData) => dispatch => {
    if (!postData.place_id) {
        postData.place_id = Auth.getUserPlace();
    }
    
    return axios
        .post(API_URL + `checkpoints?host=${window.location.origin}`, postData)
        // .then(post => {
        //     post = post.data;

        //     dispatch(addSuccessMessage())
        // }
        // )
        // .catch(function (error) {
        //     dispatch(addErrorMessages(error.response.data.error.errors));
        // });
}


export const addCheckpoint = (historyy, postData, imageData) => dispatch => {
    if (!postData.place_id) {
        postData.place_id = Auth.getUserPlace();
    }
    axios
        .post(API_URL + `tables?host=${window.location.origin}`, postData)
        .then(post => {
            post = post.data;
            dispatch(addImage(imageData, post.id));

            dispatch(addSuccessMessage())
        }
        )
        .catch(function (error) {
            dispatch(addErrorMessages(error.response.data.error.errors));
        });



    // fetch(API_URL + 'tables', {
    //     method: 'POST',
    //     headers: {
    //         'content-type': 'application/json'
    //     },
    //     body: JSON.stringify(postData)
    // })
    // .then(res => res.json())
    // .then(function(post) {
    //     // if (post.error) {
    //     //     dispatch({
    //     //         type: ADD_EDIT_TABLE_ERROR,
    //     //         payload: post.error.errors
    //     //     })
    //     // } else {

    //         // history.push(ADMIN_URL + 'tables');
    //     // }
    // })
    // .catch(function(e) {
    //     dispatch(addErrorMessages(e.response.data.error.errors));
    // });
}

export const bulkAddCheckpoints = (history, data) => dispatch => {

    dispatch(showLoading());

    axios
        .post(API_URL + `tables/bulk_create?host=${window.location.origin}`, data, { 'Content-Type': 'multipart/form-data' })
        .then(
            function (post) {
                dispatch(listCheckpoints());
                dispatch(hideLoading());

                history.push(ADMIN_URL + 'tables');
            }
        )
        .catch(function (error) {
            dispatch(addErrorMessages(error.response.data.error.errors));
        });

}

export const editCheckpoint = (id, postData, history = null, imageData = null) => dispatch => {
    if (!postData.place_id) {
        postData.place_id = Auth.getUserPlace();
    }

    axios
        .put(API_URL + 'tables/' + id, postData)
        .then(post => {
            post = post.data;

            if(imageData) {
                dispatch(addImage(imageData, post.id));
            }

            // dispatch(addSuccessMessage())
            dispatch(listCheckpoints());
        })
        .catch(function (error) {
            dispatch(addErrorMessages(error.response.data.error.errors));
        });
}

// api/tables/:id/upload

export const addImage = (file, tableId) => dispatch => {
    axios
        .post(API_URL + `tables/${tableId}/upload`, file)
        .then(res => {

            // dispatch(addSuccessMessage())
            history.push(ADMIN_URL + 'tables');
        }
        )
        .catch(function (error) {
            dispatch(addErrorMessages(error.response.data.error.errors));
        });


    // fetch(API_URL + `tables/${tableId}/upload`, {
    //     method: 'POST',
    //     body: file //{"files": file, "productId": productId}
    // })
    // .then(res => res.json())
    // .then(function(res) {
    //     // history.push(ADMIN_URL + 'products');
    //     history.push(ADMIN_URL + 'tables');                


    //     // history.push(ADMIN_URL + 'products');
    //     //TODO toastr: Msg za uspeshno/neuspeshno kachvane na snimka
    // });

}


export const removeCheckpoint = (id, history) => dispatch => {
    axios
        .put(API_URL + 'tables/' + id, { deleted: true })
        .then(res => {
            if (history) {
                // Deleting from /edit
                history.push(ADMIN_URL + "tables")
            } else {
                // Deleting from /list
                dispatch(listCheckpoints())
                dispatch(addSuccessMessage('Success deleting table'))
            }
        })
        .catch(function (error) {
            dispatch(addErrorMessages(error.response.data.error.errors));
        });



    // fetch(API_URL + 'tables/'+id, {
    //     method: 'PUT',
    //     headers: {
    //         'content-type': 'application/json'
    //     },
    //     body: JSON.stringify({deleted:true})
    // })
    // .then(res => res.json())
    // .then(
    //     function(res) {
    //         if (history) {
    //             // Deleting from /edit
    //             history.push(ADMIN_URL + "tables")
    //         } else { 
    //             // Deleting from /list
    //             dispatch(listTables())
    //         }
    //     }
    // )
    // .catch(function(e) {
    // });
}
