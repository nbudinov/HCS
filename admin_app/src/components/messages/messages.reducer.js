import { ADD_ERROR_MESSAGES, CLEAR_MESSAGES, ADD_SUCCESS_MESSAGE } from './types';

const initialState = {
    errors: [],
    success: ""
}

export default function(state = initialState, action) {
    switch(action.type) {
        case ADD_ERROR_MESSAGES:
            return {
                ...state,
                // errors: action.payload.message ? [action.payload.message] : action.payload,
                errors: action.payload
            }
        case CLEAR_MESSAGES:
            return {
                ...state,
                errors: [],
                success: "",
            }
        case ADD_SUCCESS_MESSAGE:
            return {
                ...state,
                success: action.payload
            }
        default:
            return state;
    }
}