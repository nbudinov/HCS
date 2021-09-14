import { SHOW_LOADING, HIDE_LOADING } from './types';

const initialState = {
    isLoading: false,
}

export default function(state = initialState, action) {
    switch(action.type) {
        case SHOW_LOADING:
            return {
                ...state,
                isLoading: true
            }
        case HIDE_LOADING:
            return {
                ...state,
                isLoading: false
            }
        default:
            return state;
    }
}