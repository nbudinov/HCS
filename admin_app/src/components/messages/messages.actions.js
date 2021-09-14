import { ADD_ERROR_MESSAGES, CLEAR_MESSAGES, ADD_SUCCESS_MESSAGE}
     from './types';

export const clearMessages = () => dispatch => {
    dispatch({
        type: CLEAR_MESSAGES
    })
}

export const addErrorMessages = (msgs) => dispatch => {
    dispatch(clearMessages());
    dispatch({
        type: ADD_ERROR_MESSAGES,
        payload: msgs
    })
}

export const addSuccessMessage = (msg) => dispatch => {
    dispatch(clearMessages());
    dispatch({
        type: ADD_SUCCESS_MESSAGE,
        payload: msg
    })
}
