import { SHOW_LOADING, HIDE_LOADING }
     from './types';

export const showLoading = () => dispatch => {
    dispatch({
        type: SHOW_LOADING
    })
}

export const hideLoading = () => dispatch => {
    dispatch({
        type: HIDE_LOADING,
    })
}