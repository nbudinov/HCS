import { LIST_USERS, ADD_EDIT_USER_ERROR, LIST_USER_ROLES, LIST_REGISTERED_USERS } from '../actions/types';

const initialState = {
    users: [],
    registered_users: [],
    roles: [],
    errors: [],
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LIST_USERS:
            return {
                ...state,
                users: action.payload,
                errors: [] // Reset add/edit users error
            }
        case LIST_REGISTERED_USERS: 
            return {
                ...state,
                registered_users: action.payload
            }
        case LIST_USER_ROLES: 
            return {
                ...state,
                roles: action.payload,
                errors: []
            }
        case ADD_EDIT_USER_ERROR:
            return {
                ...state,
                errors: action.payload
            }
        default:
            return state;
    }
}