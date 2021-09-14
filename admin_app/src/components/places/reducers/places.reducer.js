import { LIST_PLACES, LIST_ORDERTYPES, LIST_FUNCTIONALITY_MODULES, GET_PLACES_SMS, GET_CITIES } from '../actions/types';

const initialState = {
    places: [],
    ordertypes: [],
    functionality_modules: [],
    places_sms_logs: [],
    cities: [],
}

export default function(state = initialState, action) {
    switch(action.type) {
        case LIST_PLACES: {
            return {
                ...state,
                places: action.payload,
            }
        }
        case LIST_ORDERTYPES: {
            return {
                ...state,
                ordertypes: action.payload,
            }
        }
        case LIST_FUNCTIONALITY_MODULES: {
            return {
                ...state,
                functionality_modules: action.payload,
            }
        }
        case GET_PLACES_SMS: {
            return {
                ...state,
                places_sms_logs: action.payload
            }
        }
        case GET_CITIES: {
            return {
                ...state,
                cities: action.payload
            }
        }
        
        default:
            return state;
    }
}