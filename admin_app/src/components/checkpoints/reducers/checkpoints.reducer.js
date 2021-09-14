import { LIST_CHECKPOINTS } from '../actions/types';

const initialState = {
    checkpoints: [],
    errors: [],
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LIST_CHECKPOINTS:
            return {
                ...state,
                checkpoints: action.payload,
                errors: [] // Reset add/edit table error
            }
     
        default:
            return state;
    }
}