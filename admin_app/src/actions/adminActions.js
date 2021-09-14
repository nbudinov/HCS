import { SET_SOUND_ACTIVATION, CHANGE_ORDER_STYLE_TYPE, SET_SNACKBAR_TEXT, OPEN_CONFIRM_MODAL, CLOSE_CONFIRM_MODAL } from './types';

export const setSoundActivation = (value) => dispatch => {
    dispatch({
        type: SET_SOUND_ACTIVATION,
        payload: value
    })
}

export const changeOrdersStyleType = () => dispatch => {
    dispatch({
        type: CHANGE_ORDER_STYLE_TYPE,
    })
}

export const setSnackbarText = (v) => dispatch => {
    dispatch({
        type: SET_SNACKBAR_TEXT,
        payload: v
    })
}

export const openConfirmModal = (text, callbackSuccess, callbackFail) => dispatch => {
    let obj = {};
    obj.text = text;
    obj.callbackSuccess = callbackSuccess;
    obj.callbackFail = callbackFail;
    dispatch({
        type: OPEN_CONFIRM_MODAL,
        payload: obj
    });
}

export const closeConfirmModal = () => dispatch => {
    dispatch({
        type: CLOSE_CONFIRM_MODAL
    });
}