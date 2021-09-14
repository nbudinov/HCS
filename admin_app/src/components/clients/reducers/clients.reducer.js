import { LIST_CLIENTS } from '../actions/types';

const initialState = {
    clients: []
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LIST_CLIENTS: {
            return {
                ...state,
                clients: action.payload,
            }
        }
        default:
            return state;
    }
}