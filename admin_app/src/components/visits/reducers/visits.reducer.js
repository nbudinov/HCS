import { LIST_VISITS } from '../actions/types';

const initialState = {
    visits: [],
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LIST_VISITS: {
            return {
                ...state,
                visits: action.payload,
            }
        }
        
        default:
            return state;
    }
}